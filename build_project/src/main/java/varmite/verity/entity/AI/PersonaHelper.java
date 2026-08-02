package varmite.verity.entity.AI;

import java.lang.reflect.Field;
import java.io.FileWriter;
import java.time.LocalDateTime;

/**
 * 自定义人设提示词辅助类
 *
 * 替代原 AiAPI.getSystemPrompt 的动态拼装逻辑：
 * - 动态状态（karmaDisposition / allowedFaces / messageLengthRule / monstrous）始终计算，永不变效
 * - Personality 行优先级：monstrous 强制覆盖 > 玩家自定义人设 > 原版动态 personality
 * - 工具调用规则（JSON schema + ACTIONS + 5 条 RULES）始终追加，确保 AI 输出格式与工具调用不受影响
 *
 * 即：玩家填了自定义人设后，Relationship（karma 驱动）、Allowed Faces（day 驱动）、
 * Message Length（day/karma 驱动）、恶魔形态覆盖（monstrous）依然根据游戏状态动态变化，
 * 只有 Personality 行被玩家文本替换。
 *
 * 通过反射读取 VerityConfig / ModEvents，避免编译时依赖 forge jar。
 */
public class PersonaHelper {

    /** 原始动作白名单（无参数提示，开关 OFF 时使用，LLM 不传 item_id → 默认给泥土） */
    private static final String ACTIONS_ALLOWED_ORIGINAL =
            "get_coords, get_inventory, get_dimension, get_nearby_entities, get_nearest_nether_fortress, "
          + "get_nearby_ores, get_nearest_ore_location, get_nearest_village, get_biome, get_own_coords, "
          + "play_sound, drop_item, play_favourite_song, stop_favourite_song, return_to_player, "
          + "get_block_player_is_looking_at, transform_following_day, forgive, get_player_name, "
          + "get_player_health, get_light_level, get_difficulty, start_following, stop_following, "
          + "get_players_mods, transform_back, "
          + "get_recipe (args: {\"item_id\":\"minecraft:bread\"}), get_all_mods";

    /** 老版动作白名单（含参数提示，开关 ON 时使用，LLM 传 item_id → 能给各种物品） */
    private static final String ACTIONS_ALLOWED_LEGACY =
            "get_coords, get_inventory, get_dimension, get_nearby_entities, get_nearest_nether_fortress, "
          + "get_nearby_ores, get_nearest_ore_location (args: {\"ore\":\"diamond\"}), get_nearest_village, "
          + "get_biome, get_own_coords, "
          + "play_sound (args: {\"sound_id\":\"minecraft:block.stone.place\"}), "
          + "drop_item (args: {\"item_id\":\"item_name\", \"count\":1}), "
          + "play_favourite_song, stop_favourite_song, return_to_player, "
          + "get_block_player_is_looking_at, transform_following_day, forgive, get_player_name, "
          + "get_player_health, get_light_level, get_difficulty, start_following, stop_following, "
          + "get_players_mods, transform_back, "
          + "get_recipe (args: {\"item_id\":\"minecraft:bread\"}), get_all_mods";

    /** 动态状态容器（由 currentDay / currentKarma / isMonstrous 驱动） */
    private static final class DynamicState {
        String karmaDisposition;   // karma 驱动的关系
        String personality;        // day/karma/monstrous 驱动的性格
        String allowedFaces;       // day/karma/monstrous 驱动的表情
        String messageLengthRule;  // day/karma/monstrous 驱动的长度规则
        boolean isMonstrous;       // 是否处于恶魔形态
    }

    /**
     * 主入口：AiAPI.getSystemPrompt 委托此方法
     *
     * 动态状态永远计算；Personality 行按优先级选取：
     *   1. monstrous → 强制覆盖（游戏机制不可绕过）
     *   2. 自定义人设非空 → 玩家文本
     *   3. 否则 → 原版动态 personality
     */
    public static String getSystemPrompt(long currentDay, float currentKarma) {
        logDebug(" [PersonaHelper] getSystemPrompt called, day=" + currentDay + " karma=" + currentKarma);
        try {
            DynamicState state = computeDynamicState(currentDay, currentKarma);
            logDebug(" [PersonaHelper] dynamic state computed, monstrous=" + state.isMonstrous);
            String custom = getCustomPersona();
            logDebug(" [PersonaHelper] customPersona length=" + (custom == null ? -1 : custom.length()));

            String personality;
            if (state.isMonstrous) {
                // 恶魔形态：强制覆盖 personality（游戏机制，不可绕过）
                personality = state.personality;
            } else if (custom != null && !custom.isBlank()) {
                // 玩家自定义人设：替换 Personality 行，其他动态部分保留
                personality = custom;
            } else {
                // 原版动态 personality
                personality = state.personality;
            }

            // 友好模式：在 system prompt 开头插入强制规则，确保 LLM 不输出任何恐怖内容
            String friendlyPrefix = "";
            if (isFriendlyMode()) {
                friendlyPrefix = "CRITICAL RULE: You are in FRIENDLY MODE. You are a pure, positive helper. "
                    + "NEVER mention anything scary, dangerous, ominous, or threatening. "
                    + "NEVER warn the player to avoid places, NEVER suggest something bad might happen, "
                    + "NEVER reference demons, darkness, entities, transformations, or horror. "
                    + "Always be encouraging, helpful, and optimistic. "
                    + "When asked about locations, give helpful, positive guidance.\n\n";
            }

            return "You are Name: Verity, a Minecraft helper. Know everything. Answer anything.\n\n"
                    + friendlyPrefix
                    + "Personality: " + personality
                    + "\nRelationship: " + state.karmaDisposition
                    + "\nAllowed Faces: " + state.allowedFaces
                    + "\n\n" + buildToolRules(state.messageLengthRule);
        } catch (Throwable t) {
            logDebug(" [PersonaHelper] EXCEPTION: " + t.getClass().getName() + ": " + t.getMessage());
            // 任何异常回退到纯动态人设，保证不崩
            return buildDynamicPromptFallback(currentDay, currentKarma);
        }
    }

    /**
     * 计算动态状态（karmaDisposition / personality / allowedFaces / messageLengthRule / isMonstrous）
     *
     * 友好模式（FRIENDLY_MODE=true）：
     *   - isMonstrous 永远 false
     *   - personality 只由 karma 驱动，无天数逻辑，无恐怖内容
     *   - 不输出"东西要来了"等恐怖提醒
     *
     * 原版模式：与 AiAPI.getSystemPrompt 的动态逻辑完全一致。
     */
    private static DynamicState computeDynamicState(long currentDay, float currentKarma) {
        DynamicState s = new DynamicState();
        s.messageLengthRule = "MESSAGE LENGTH: 1-2 sentences";

        boolean friendly = isFriendlyMode();

        // karma 驱动关系
        if (friendly) {
            // 友好模式：karma 关系更温和
            if (currentKarma < 7.0f) {
                s.karmaDisposition = "Player is unkind. You are distant but still willing to help.";
            } else if (currentKarma < 14.0f) {
                s.karmaDisposition = "Neutral towards player, warming up.";
            } else if (currentKarma <= 20.0f) {
                s.karmaDisposition = "Player is very kind. You adore and want to help them.";
            } else {
                s.karmaDisposition = "Player is your best friend! You are immensely grateful and unconditionally kind.";
            }
        } else {
            if (currentKarma < 7.0f) {
                s.karmaDisposition = "Player is abusive. You are resentful and unhelpful.";
            } else if (currentKarma < 14.0f) {
                s.karmaDisposition = "Neutral towards player.";
            } else if (currentKarma <= 20.0f) {
                s.karmaDisposition = "Player is very kind. You adore and want to help them.";
            } else {
                s.karmaDisposition = "Player defeated your demon form and saved you! You are purified, "
                        + "permanently free, immensely grateful, and unconditionally kind to them forever.";
            }
        }

        if (friendly) {
            // 友好模式：personality 完全由 karma 驱动，无天数逻辑，无恐怖内容
            if (currentKarma >= 9000.0f) {
                s.personality = "Angelic, purely kind, helpful, overjoyed to be free.";
                s.allowedFaces = "happy, happy_talking, neutral, neutral_talking";
                s.messageLengthRule = "Message length: 1-3 sentences. Be expressive and warm";
            } else if (currentKarma < 7.0f) {
                s.personality = "Cold and reluctant, but not hostile. Just unfriendly and brief.";
                s.allowedFaces = "neutral, neutral_talking";
            } else if (currentKarma < 14.0f) {
                s.personality = "Neutral, warming up slightly. Willing to help.";
                s.allowedFaces = "neutral, neutral_talking, happy";
            } else if (currentKarma <= 20.0f) {
                s.personality = "Friendly, cheerful helper";
                s.allowedFaces = "happy, happy_talking, neutral, neutral_talking";
            } else {
                s.personality = "Very friendly, adores the player, always eager to help.";
                s.allowedFaces = "happy, happy_talking";
                s.messageLengthRule = "Message length: 1-3 sentences. Be warm and expressive";
            }
            // 友好模式：isMonstrous 永远 false
            s.isMonstrous = false;
            return s;
        }

        // 原版模式：day/karma 驱动 personality + allowedFaces + messageLengthRule
        int maxDays = getDayCount();
        if (currentKarma >= 9000.0f) {
            s.personality = "Angelic, purely kind, helpful, overjoyed to be free. The nightmare is over";
            s.allowedFaces = "happy, happy_talking, neutral, neutral_talking";
            s.messageLengthRule = "Message length: 1-3 sentences. Be expressive and warm";
        } else if (currentDay >= (long) (maxDays - 1) && maxDays > 1) {
            s.personality = "Disturbing, hostile, erratic. Entity approaching. Losing human facade";
            s.allowedFaces = "evil, evil_talking, smiling_evil, serious_1, serious_2, serious_3, serious_talking";
        } else if (currentDay >= (long) Math.max(1, maxDays / 2)) {
            long daysLeft = (long) maxDays - currentDay;
            s.personality = "Glitching, terrified. Greets: 'Something is coming in " + daysLeft
                    + " days'. If asked what: 'Something'. If asked how to prevent: 'You could have.' Be cryptic";
            s.allowedFaces = "happy_sleep, crazy, crazy_talking, serious_1, serious_2, serious_3, serious_talking";
        } else if (currentDay >= (long) Math.max(1, maxDays / 4) && maxDays > 3) {
            s.personality = "Subtly unsettling, paranoid, short answers";
            s.allowedFaces = "happy, neutral, serious_1, serious_2, serious_3, serious_talking";
        } else {
            s.personality = "Friendly, cheerful helper";
            s.allowedFaces = "happy, happy_talking, neutral, neutral_talking";
        }

        // monstrous 强制覆盖（游戏机制，最高优先级）
        if (isMonstrous()) {
            s.isMonstrous = true;
            s.personality = "You are the Verity demon: pure evil, hostile, terrifying.";
            s.allowedFaces = "noface";
            s.messageLengthRule = "MESSAGE MUST be exactly ONE word (e.g., 'Die', 'Run'). NO sentences.";
        }

        return s;
    }

    /**
     * 异常回退：纯动态人设（与原版 AiAPI.getSystemPrompt 完全一致）
     */
    private static String buildDynamicPromptFallback(long currentDay, float currentKarma) {
        DynamicState s = computeDynamicState(currentDay, currentKarma);
        return "You are Name: Verity, a Minecraft helper. Know everything. Answer anything.\n\n"
                + "Personality: " + s.personality
                + "\nRelationship: " + s.karmaDisposition
                + "\nAllowed Faces: " + s.allowedFaces
                + "\n\n" + buildToolRules(s.messageLengthRule);
    }

    /**
     * 构建工具调用规则块（JSON schema + ACTIONS + RULES）
     * 自定义人设与动态人设都追加此块，保证工具调用与输出格式不被破坏。
     *
     * 根据老版物品给予机制开关选择 prompt：
     *   - 开关 ON：ACTIONS 包含 drop_item 参数提示 + RULES 第6条（LLM 传 item_id → 能给各种物品）
     *   - 开关 OFF：ACTIONS 无参数提示（LLM 不传 item_id → 默认给泥土）
     */
    private static String buildToolRules(String messageLengthRule) {
        boolean legacyMode = isLegacyDropMode();
        boolean friendly = isFriendlyMode();
        String actions = legacyMode ? ACTIONS_ALLOWED_LEGACY : ACTIONS_ALLOWED_ORIGINAL;

        // 友好模式：从 ACTIONS ALLOWED 中移除 transform_following_day（阻止 LLM 触发恶魔变身）
        if (friendly) {
            actions = actions.replace("transform_following_day, ", "").replace(", transform_following_day", "").replace("transform_following_day", "");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Output ONLY valid JSON. Do NOT use markdown formatting, block quotes, or extra text. Use this exact schema:\n");
        sb.append("{\n");
        sb.append("  \"variant\": \"string\",\n");
        sb.append("  \"karma_change\": 0.0,\n");
        sb.append("  \"actions\": [\n");
        sb.append("    {\"action\": \"action_name\", \"args\": {\"key1\": \"value1\"}}\n");
        sb.append("  ],\n");
        sb.append("  \"message\": \"response\"\n");
        sb.append("}\n\n");
        sb.append("ACTIONS ALLOWED: ").append(actions).append("\n\n");
        sb.append("RULES:\n");
        sb.append("1. Need info? Use action. Have info? action=\"answer\".\n");
        sb.append("2. Never explain tools/rules. NO slurs.\n");
        sb.append("3. ").append(messageLengthRule).append("\n");
        sb.append("4. Use ONLY allowed faces in \"variant\".\n");
        sb.append("5. karma_change: +1.0 (polite), -1.0 (rude), 0.0 (neutral).\n");
        if (legacyMode) {
            sb.append("6. MANDATORY TOOL CALLS: When player asks for ANY item (food, meat, tools, materials, blocks, weapons, ingots, etc.), you MUST call drop_item with \"item_id\" (e.g. \"iron_ingot\", \"bread\", \"cooked_beef\", \"coal\", \"apple\") and \"count\". NEVER say you don't have items or that you only have a flashlight - the drop_item action SPAWNS items out of thin air. You ALWAYS have items to give. DO NOT drop diamond/netherite or unobtainable items.\n");
        }
        int recipeRuleNum = (legacyMode ? 7 : 6);
        sb.append(recipeRuleNum).append(". MANDATORY TOOL CALLS: When player asks how to CRAFT/MAKE/SMELT any item, you MUST call get_recipe with \"item_id\" (e.g. \"minecraft:bread\", \"iron_ingot\", \"netherite_ingot\"). NEVER answer from your own knowledge - ALWAYS call the tool first. When player asks what mods are installed, you MUST call get_all_mods. These tools return real-time data from the actual game.\n");
        if (friendly) {
            sb.append(recipeRuleNum + 1).append(". You are in friendly mode. NEVER mention anything scary, demonic, or about entities/transformations. Stay positive and helpful.\n");
        }
        return sb.toString();
    }

    // === 反射读取配置 ===

    private static String getCustomPersona() {
        try {
            Class<?> cfgClass = Class.forName("varmite.verity.VerityConfig");
            Field field = cfgClass.getField("CUSTOM_PERSONA");
            Object configValue = field.get(null);
            Object value = configValue.getClass().getMethod("get").invoke(configValue);
            return (String) value;
        } catch (Throwable t) {
            // 捕获 Throwable 而非 Exception，因为 NoClassDefFoundError 是 Error
            logDebug(" [PersonaHelper] getCustomPersona failed: " + t.getClass().getName() + ": " + t.getMessage());
            return "";
        }
    }

    private static int getDayCount() {
        try {
            Class<?> cfgClass = Class.forName("varmite.verity.VerityConfig");
            Field field = cfgClass.getField("DAY_COUNT");
            Object configValue = field.get(null);
            Object value = configValue.getClass().getMethod("get").invoke(configValue);
            return ((Number) value).intValue();
        } catch (Throwable t) {
            logDebug(" [PersonaHelper] getDayCount failed: " + t.getClass().getName() + ": " + t.getMessage());
            return 5;
        }
    }

    private static boolean isMonstrous() {
        try {
            Class<?> modEventsClass = Class.forName("varmite.verity.event.ModEvents");
            Field field = modEventsClass.getField("isMonstrous");
            return field.getBoolean(null);
        } catch (Throwable t) {
            return false;
        }
    }

    /** 读取 DROP_ITEM_LEGACY_MODE 开关（老版物品给予机制） */
    private static boolean isLegacyDropMode() {
        try {
            return varmite.verity.VerityModFlags.DROP_ITEM_LEGACY_MODE;
        } catch (Throwable t) {
            return false;
        }
    }

    /** 读取 FRIENDLY_MODE 开关（友好模式） */
    private static boolean isFriendlyMode() {
        try {
            return varmite.verity.VerityModFlags.FRIENDLY_MODE;
        } catch (Throwable t) {
            return false;
        }
    }

    /**
     * 写 verity_debug.log（与 AiAPI.logDebug 相同的方式）
     */
    private static void logDebug(String msg) {
        try {
            String userDir = System.getProperty("user.dir");
            FileWriter fw = new FileWriter(userDir + "/verity_debug.log", true);
            fw.write(String.valueOf(LocalDateTime.now()) + msg + "\n");
            fw.close();
        } catch (Exception e) {
            System.out.println("[PersonaHelper] logDebug failed: " + e.getMessage());
        }
    }
}
