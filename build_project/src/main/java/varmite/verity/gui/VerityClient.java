package varmite.verity.gui;

import me.shedaniel.clothconfig2.api.AbstractConfigListEntry;
import me.shedaniel.clothconfig2.api.ConfigBuilder;
import me.shedaniel.clothconfig2.api.ConfigCategory;
import me.shedaniel.clothconfig2.api.ConfigEntryBuilder;
import me.shedaniel.clothconfig2.impl.builders.SubCategoryBuilder;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import varmite.verity.CloneVoice;
import varmite.verity.MimoApiEndpoint;
import varmite.verity.SttMode;
import varmite.verity.TtsMode;
import varmite.verity.VerityAccountBridge;
import varmite.verity.VerityConfig;
import varmite.verity.VerityVoice;

import java.io.File;
import java.lang.reflect.Field;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

/**
 * Verity 配置界面（基于 Cloth Config API）。
 *
 * 方法名 createYACLScreen / rebuildScreen / preserveConnTest / originalParent
 * 保留以兼容 VerityClientBootstrap 与 VerityAccountBridge 的原有调用。
 *
 * 特性：
 *   - 多分类标签（顶部 Tab）
 *   - 子分组（SubCategory）
 *   - 整数滑条（纹理色调）
 *   - 多行文本（自定义人设）
 *   - 选择器（皮肤、克隆音频）
 *   - 每项配置含 tooltip 描述
 */
public class VerityClient {

    public static boolean preserveConnTest = false;
    public static Screen originalParent = null;
    /** 标记：当前正在重建屏幕，不应更新 originalParent */
    private static boolean isRebuilding = false;

    public static Screen createYACLScreen(Screen previousScreen) {
        // 仅在非重建时更新 originalParent（重建时 previousScreen 是旧配置屏幕，不能覆盖）
        if (!isRebuilding && previousScreen != null) {
            originalParent = previousScreen;
        }
        if (!preserveConnTest) {
            try {
                VerityConfig.VERITY_CONN_LLM.set("");
                VerityConfig.VERITY_CONN_TTS.set("");
                VerityConfig.VERITY_CONN_STT.set("");
            } catch (Throwable ignored) {}
        }
        preserveConnTest = false;

        // 若已有 Verity 账户密钥，预拉取账户信息
        String key = (String) VerityConfig.VERITY_BRIDGE_KEY.get();
        if (key != null && !key.isEmpty()) {
            try { VerityAccountBridge.fetchValues(key); } catch (Throwable ignored) {}
        }

        ConfigBuilder builder = ConfigBuilder.create()
                .setParentScreen(previousScreen)
                .setTitle(Component.literal("Verity 配置"))
                .setTransparentBackground(true)
                .setAfterInitConsumer(screen -> {
                    // 配置界面初始化后的回调（可用于调整样式）
                });

        ConfigEntryBuilder entryBuilder = builder.entryBuilder();

        // === 各分类 ===
        buildGeneralCategory(builder, entryBuilder);
        buildModifyCategory(builder, entryBuilder);
        buildPersonaCategory(builder, entryBuilder);
        buildLLMCategory(builder, entryBuilder);
        buildTTSCategory(builder, entryBuilder);
        buildSTTCategory(builder, entryBuilder);
        buildAccountCategory(builder, entryBuilder);

        // 保存回调
        builder.setSavingRunnable(() -> {
            // 配置已由各 setSaveConsumer 直接写入，此处可触发额外的保存后逻辑
            try {
                String skin = (String) VerityConfig.SKIN.get();
                Class.forName("varmite.verity.SkinManager")
                     .getMethod("setSkin", String.class).invoke(null, skin);
            } catch (Throwable ignored) {}
        });

        return builder.build();
    }

    /** 重建当前配置屏幕（由 VerityAccountBridge.fetchAndRebuild / testAllModels 调用） */
    public static void rebuildScreen() {
        Minecraft mc = Minecraft.getInstance();
        if (mc == null || mc.screen == null) return;
        // 用 originalParent（Mods 列表）作为新屏幕的 parent，保持返回链完整：
        // 新配置 → Mods 列表 → 游戏菜单 → 游戏
        isRebuilding = true;
        try {
            Screen parent = originalParent != null ? originalParent : mc.screen;
            mc.setScreen(createYACLScreen(parent));
        } finally {
            isRebuilding = false;
        }
    }

    // ==================== 通用分类 ====================

    private static void buildGeneralCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("通用"));

        cat.addEntry(eb.startBooleanToggle(Component.literal("可被踢出"), (Boolean) VerityConfig.CAN_CRASH.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("允许 Verity 将你踢出服务器"))
                .setSaveConsumer(v -> VerityConfig.CAN_CRASH.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("开场动画"), (Boolean) VerityConfig.PLAY_VIDEO.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("客户端启动时播放 Verity 开场动画"))
                .setSaveConsumer(v -> VerityConfig.PLAY_VIDEO.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("必须喊名字"), (Boolean) VerityConfig.REQUIRE_VERITY.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("每句话中必须包含 'Verity' 才能与他交流"))
                .setSaveConsumer(v -> VerityConfig.REQUIRE_VERITY.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("极限黑暗"), (Boolean) VerityConfig.TRUE_DARKNESS.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("极限黑暗效果开关"))
                .setSaveConsumer(v -> VerityConfig.TRUE_DARKNESS.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("显示 Karma 条"), (Boolean) VerityConfig.SHOW_VERITYS_KARMA.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("快捷栏上方显示 Karma 好感度条"))
                .setSaveConsumer(v -> VerityConfig.SHOW_VERITYS_KARMA.set(v))
                .build());

        cat.addEntry(eb.startIntSlider(Component.literal("黑化天数"), (Integer) VerityConfig.DAY_COUNT.get(), 1, 100)
                .setDefaultValue(5)
                .setTooltip(Component.literal("游戏天数达到此值后 Verity 变为恶魔形态"))
                .setSaveConsumer(v -> VerityConfig.DAY_COUNT.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("沉浸模式"), (Boolean) VerityConfig.IMMERSIVE_MODE.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("隐藏所有 Verity UI 和聊天消息"))
                .setSaveConsumer(v -> VerityConfig.IMMERSIVE_MODE.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("下落时叫声"), (Boolean) VerityConfig.FALL_SOUND_ENABLED.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("Verity 从高处掉落时是否发出叫声"))
                .setSaveConsumer(v -> VerityConfig.FALL_SOUND_ENABLED.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("主菜单黑屏背景"), (Boolean) VerityConfig.MENU_BLACK_SCREEN_ENABLED.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("主菜单使用黑屏背景而非全景背景"))
                .setSaveConsumer(v -> VerityConfig.MENU_BLACK_SCREEN_ENABLED.set(v))
                .build());
    }

    // ==================== 修改分类 ====================

    private static void buildModifyCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("修改"));

        cat.addEntry(eb.startBooleanToggle(Component.literal("击杀村民"), (Boolean) VerityConfig.KILL_VILLAGERS.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("Verity 是否击杀村民"))
                .setSaveConsumer(v -> VerityConfig.KILL_VILLAGERS.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("友好模式"), getFriendlyMode())
                .setDefaultValue(false)
                .setTooltip(Component.literal("开启后 Verity 不再杀死任何生物，取消恶魔变身和恐怖事件，性格随 Karma 变化。\n不再有'东西要来了'等恐怖提醒，变为纯粹的助手。"))
                .setSaveConsumer(v -> setFriendlyMode(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("使用老版物品给予机制"), getLegacyDropMode())
                .setDefaultValue(false)
                .setTooltip(Component.literal("开启后跳过稀有度黑名单，Verity 可给予更多种类的物品（如 5.6.3 版本行为）。\n关闭则保留新版黑名单限制（钻石/下界合金等稀有物不可给予）。"))
                .setSaveConsumer(v -> setLegacyDropMode(v))
                .build());
    }

    // ==================== 个性化分类 ====================

    private static void buildPersonaCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("个性化"));

        // 纹理色调 - 滑条
        cat.addEntry(eb.startIntSlider(Component.literal("纹理色调"), (Integer) VerityConfig.COLOR.get(), 0, 360)
                .setDefaultValue(0)
                .setTooltip(Component.literal("Verity 纹理色调（0-360度，0=原始颜色）"))
                .setSaveConsumer(v -> {
                    VerityConfig.COLOR.set(v);
                    try {
                        Class.forName("varmite.verity.client.VerityPreviewTexture")
                             .getMethod("applyHue", int.class).invoke(null, v);
                    } catch (Throwable ignored) {}
                })
                .build());

        // 自定义人设 - 多行文本框
        cat.addEntry(eb.startTextField(Component.literal("自定义人设"), getStr(VerityConfig.CUSTOM_PERSONA.get()))
                .setDefaultValue("")
                .setTooltip(Component.literal("输入自定义人设提示词，留空则使用 Verity 默认动态人设。支持多行输入。"))
                .setSaveConsumer(v -> VerityConfig.CUSTOM_PERSONA.set(v))
                .build());

        // 皮肤选择 - 子分组
        SubCategoryBuilder skinGroup = eb.startSubCategory(Component.literal("皮肤"));
        skinGroup.setTooltip(Component.literal("从 config/verity/skins/ 目录中选择皮肤ZIP文件，Verity 为内置默认皮肤。"));
        skinGroup.setExpanded(true);
        String[] skinNames = listSkins();
        String currentSkin = getStr(VerityConfig.SKIN.get());
        // 转换为 String[]，Cloth Config 的 startSelector 需要 T[]
        // 这里用 String 作为选择器
        if (skinNames.length > 0) {
            // 找到当前皮肤的索引，确保在列表中
            String selectedSkin = currentSkin;
            boolean found = false;
            for (String s : skinNames) {
                if (s.equals(currentSkin)) { found = true; break; }
            }
            if (!found) selectedSkin = skinNames[0];
            skinGroup.add(eb.startSelector(Component.literal("选择皮肤"), skinNames, selectedSkin)
                    .setNameProvider(s -> Component.literal((String) s))
                    .setDefaultValue("Verity")
                    .setTooltip(Component.literal("点击下拉选择皮肤，Verity 为内置皮肤"))
                    .setSaveConsumer(v -> {
                        VerityConfig.SKIN.set((String) v);
                        try {
                            Class.forName("varmite.verity.SkinManager")
                                 .getMethod("setSkin", String.class).invoke(null, (String) v);
                        } catch (Throwable ignored) {}
                    })
                    .build());
        } else {
            skinGroup.add(eb.startTextDescription(Component.literal("§7未找到皮肤文件，请将 ZIP 放入 config/verity/skins/")).build());
        }
        cat.addEntry(skinGroup.build());
    }

    // ==================== LLM 分类 ====================

    private static void buildLLMCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("LLM"));

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用 LLM"), (Boolean) VerityConfig.LLM_ENABLED.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("关闭后 Verity 将无法进行智能对话\n国内推荐：DeepSeek、通义千问、硅基流动等"))
                .setSaveConsumer(v -> VerityConfig.LLM_ENABLED.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用 Verity Mod 配置"), (Boolean) VerityConfig.USE_VERITY_PROXY_LLM.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("启用后 LLM 请求走 Verity Mod 官方代理，下方所有设置无效"))
                .setSaveConsumer(v -> VerityConfig.USE_VERITY_PROXY_LLM.set(v))
                .build());

        cat.addEntry(eb.startStrField(Component.literal("Base URL"), getStr(VerityConfig.LLM_BASE_URL.get()))
                .setDefaultValue("https://api.deepseek.com/v1")
                .setTooltip(Component.literal("API 基础地址（OpenAI 兼容格式），如 https://api.deepseek.com/v1"))
                .setSaveConsumer(v -> VerityConfig.LLM_BASE_URL.set(v))
                .build());

        cat.addEntry(eb.startStrField(Component.literal("API Key"), getStr(VerityConfig.LLM_API_KEY.get()))
                .setDefaultValue("")
                .setTooltip(Component.literal("API 密钥（sk-xxxxx 格式）"))
                .setSaveConsumer(v -> VerityConfig.LLM_API_KEY.set(v))
                .build());

        cat.addEntry(eb.startStrField(Component.literal("模型名称"), getStr(VerityConfig.LLM_MODEL.get()))
                .setDefaultValue("deepseek-chat")
                .setTooltip(Component.literal("例如: deepseek-chat, qwen-plus, glm-4-flash 等"))
                .setSaveConsumer(v -> VerityConfig.LLM_MODEL.set(v))
                .build());
    }

    // ==================== TTS 分类 ====================

    private static void buildTTSCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("TTS"));

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用 TTS"), (Boolean) VerityConfig.USE_TTS.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("总开关：是否让 Verity 说话"))
                .setSaveConsumer(v -> VerityConfig.USE_TTS.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用 Verity Mod 配置"), (Boolean) VerityConfig.USE_VERITY_PROXY_TTS.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("启用后 TTS 请求走 Verity Mod 官方代理，下方所有设置无效"))
                .setSaveConsumer(v -> VerityConfig.USE_VERITY_PROXY_TTS.set(v))
                .build());

        cat.addEntry(eb.startEnumSelector(Component.literal("TTS 模式"), TtsMode.class, (TtsMode) VerityConfig.TTS_MODE.get())
                .setDefaultValue(TtsMode.BUILT_IN)
                .setTooltip(Component.literal("内置TTS=本地Piper引擎 / Base URL=自定义API / MiMo音色克隆"))
                .setSaveConsumer(v -> VerityConfig.TTS_MODE.set(v))
                .build());

        // 内置 TTS 配置子分组
        SubCategoryBuilder builtInGroup = eb.startSubCategory(Component.literal("内置 TTS 配置"));
        builtInGroup.setTooltip(Component.literal("本地 Piper 引擎配置"));
        builtInGroup.setExpanded(false);
        builtInGroup.add(eb.startEnumSelector(Component.literal("音色"), VerityVoice.class, parseVoice(getStr(VerityConfig.TTS_BUILTIN_VOICE.get())))
                .setDefaultValue(VerityVoice.DANIEL)
                .setTooltip(Component.literal("本地 Piper 引擎的音色"))
                .setSaveConsumer(v -> VerityConfig.TTS_BUILTIN_VOICE.set(v.name()))
                .build());
        cat.addEntry(builtInGroup.build());

        // Base URL 配置子分组
        SubCategoryBuilder baseUrlGroup = eb.startSubCategory(Component.literal("Base URL 配置"));
        baseUrlGroup.setTooltip(Component.literal("自定义 TTS API（OpenAI 兼容端点）"));
        baseUrlGroup.setExpanded(false);
        baseUrlGroup.add(eb.startStrField(Component.literal("Base URL"), getStr(VerityConfig.TTS_BASE_URL.get()))
                .setDefaultValue("https://api.xiaomimimo.com/v1")
                .setTooltip(Component.literal("含 xiaomimimo.com 自动兼容小米，否则走标准 OpenAI"))
                .setSaveConsumer(v -> VerityConfig.TTS_BASE_URL.set(v))
                .build());
        baseUrlGroup.add(eb.startStrField(Component.literal("Key"), getStr(VerityConfig.TTS_MIMO_API_KEY.get()))
                .setDefaultValue("")
                .setTooltip(Component.literal("API 密钥（sk-xxxxx 或 tp-xxxxx）"))
                .setSaveConsumer(v -> VerityConfig.TTS_MIMO_API_KEY.set(v))
                .build());
        baseUrlGroup.add(eb.startStrField(Component.literal("模型"), getStr(VerityConfig.TTS_BASE_MODEL.get()))
                .setDefaultValue("mimo-v2.5-tts")
                .setTooltip(Component.literal("TTS 模型名（默认 mimo-v2.5-tts）"))
                .setSaveConsumer(v -> VerityConfig.TTS_BASE_MODEL.set(v))
                .build());
        baseUrlGroup.add(eb.startStrField(Component.literal("音色"), getStr(VerityConfig.TTS_MIMO_VOICE.get()))
                .setDefaultValue("冰糖")
                .setTooltip(Component.literal("TTS 音色名称（如：冰糖、alloy、echo 等）"))
                .setSaveConsumer(v -> VerityConfig.TTS_MIMO_VOICE.set(v))
                .build());
        cat.addEntry(baseUrlGroup.build());

        // 语速配置
        cat.addEntry(eb.startDoubleField(Component.literal("TTS 语速"), ((Number) VerityConfig.TTS_SPEED.get()).doubleValue())
                .setDefaultValue(1.0)
                .setTooltip(Component.literal("TTS 播放语速（0.5-4.0）"))
                .setSaveConsumer(v -> VerityConfig.TTS_SPEED.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用流式响应"), (Boolean) VerityConfig.TTS_STREAM.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("流式 TTS 响应，减少延迟"))
                .setSaveConsumer(v -> VerityConfig.TTS_STREAM.set(v))
                .build());

        // 音色克隆配置子分组
        SubCategoryBuilder cloneGroup = eb.startSubCategory(Component.literal("MiMo 音色克隆配置"));
        cloneGroup.setTooltip(Component.literal("音色克隆端点和参考音频选择，用于 MiMo 音色克隆模式。"));
        cloneGroup.setExpanded(false);
        cloneGroup.add(eb.startEnumSelector(Component.literal("克隆端点"), MimoApiEndpoint.class, (MimoApiEndpoint) VerityConfig.TTS_CLONE_ENDPOINT.get())
                .setDefaultValue(MimoApiEndpoint.DEFAULT)
                .setTooltip(Component.literal("音色克隆 API 端点"))
                .setSaveConsumer(v -> VerityConfig.TTS_CLONE_ENDPOINT.set(v))
                .build());
        cloneGroup.add(eb.startStrField(Component.literal("克隆 Key"), getStr(VerityConfig.TTS_CLONE_API_KEY.get()))
                .setDefaultValue("")
                .setTooltip(Component.literal("API 密钥（独立于 Base URL 配置的 Key）"))
                .setSaveConsumer(v -> VerityConfig.TTS_CLONE_API_KEY.set(v))
                .build());
        cloneGroup.add(eb.startEnumSelector(Component.literal("内置克隆音色"), CloneVoice.class, (CloneVoice) VerityConfig.TTS_CLONE_VOICE.get())
                .setDefaultValue(CloneVoice.VERITY)
                .setTooltip(Component.literal("jar 内置参考音频（assets/verity/tts/reference/）"))
                .setSaveConsumer(v -> VerityConfig.TTS_CLONE_VOICE.set(v))
                .build());
        cloneGroup.add(eb.startDoubleField(Component.literal("克隆语速"), ((Number) VerityConfig.TTS_CLONE_SPEED.get()).doubleValue())
                .setDefaultValue(1.0)
                .setTooltip(Component.literal("克隆 TTS 播放语速（0.5-4.0）"))
                .setSaveConsumer(v -> VerityConfig.TTS_CLONE_SPEED.set(v))
                .build());

        // 启用自定义克隆音频开关（位于自定义音频选择器上方）
        cloneGroup.add(eb.startBooleanToggle(Component.literal("启用自定义克隆音频"), (Boolean) VerityConfig.USE_CUSTOM_CLONE_AUDIO.get())
                .setDefaultValue(true)
                .setTooltip(Component.literal("开启后使用 config/verity/sample_audio/ 下的样本音频；关闭后只使用内置预设音色"))
                .setSaveConsumer(v -> VerityConfig.USE_CUSTOM_CLONE_AUDIO.set(v))
                .build());

        // 自定义克隆音频选择器（子分组内）
        String[] audioFiles = listCloneAudios();
        if (audioFiles.length > 0) {
            String currentAudio = getStr(VerityConfig.TTS_CLONE_CUSTOM_AUDIO.get());
            String selectedAudio = currentAudio.isEmpty() ? audioFiles[0] : currentAudio;
            boolean found = false;
            for (String a : audioFiles) {
                if (a.equals(currentAudio)) { found = true; break; }
            }
            if (!found) selectedAudio = audioFiles[0];
            cloneGroup.add(eb.startSelector(Component.literal("自定义克隆音频"), audioFiles, selectedAudio)
                    .setNameProvider(s -> Component.literal((String) s))
                    .setDefaultValue(audioFiles[0])
                    .setTooltip(Component.literal("从 config/verity/sample_audio/ 目录中选择样本音频文件"))
                    .setSaveConsumer(v -> VerityConfig.TTS_CLONE_CUSTOM_AUDIO.set((String) v))
                    .build());
        } else {
            cloneGroup.add(eb.startTextDescription(Component.literal("§7未找到样本音频，请将 wav/mp3 文件放入 config/verity/sample_audio/")).build());
        }
        cat.addEntry(cloneGroup.build());
    }

    // ==================== STT 分类 ====================

    private static void buildSTTCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("STT"));

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用 STT"), (Boolean) VerityConfig.STT_ENABLED.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("总开关：是否启用语音识别（按下通话）"))
                .setSaveConsumer(v -> VerityConfig.STT_ENABLED.set(v))
                .build());

        cat.addEntry(eb.startBooleanToggle(Component.literal("启用 Verity Mod 配置"), (Boolean) VerityConfig.USE_VERITY_PROXY_STT.get())
                .setDefaultValue(false)
                .setTooltip(Component.literal("启用后 STT 请求走 Verity Mod 官方代理，下方所有设置无效"))
                .setSaveConsumer(v -> VerityConfig.USE_VERITY_PROXY_STT.set(v))
                .build());

        cat.addEntry(eb.startEnumSelector(Component.literal("STT 模式"), SttMode.class, (SttMode) VerityConfig.STT_MODE.get())
                .setDefaultValue(SttMode.LOCAL)
                .setTooltip(Component.literal("本地识别=离线Whisper / Base URL=自定义API"))
                .setSaveConsumer(v -> VerityConfig.STT_MODE.set(v))
                .build());

        cat.addEntry(eb.startStrField(Component.literal("Base URL"), getStr(VerityConfig.STT_BASE_URL.get()))
                .setDefaultValue("https://api.xiaomimimo.com/v1")
                .setTooltip(Component.literal("含 xiaomimimo.com 自动兼容小米，否则走标准 OpenAI"))
                .setSaveConsumer(v -> VerityConfig.STT_BASE_URL.set(v))
                .build());

        cat.addEntry(eb.startStrField(Component.literal("Key"), getStr(VerityConfig.STT_MIMO_API_KEY.get()))
                .setDefaultValue("")
                .setTooltip(Component.literal("API 密钥（sk-xxxxx 或 tp-xxxxx）"))
                .setSaveConsumer(v -> VerityConfig.STT_MIMO_API_KEY.set(v))
                .build());

        cat.addEntry(eb.startStrField(Component.literal("模型"), getStr(VerityConfig.STT_BASE_MODEL.get()))
                .setDefaultValue("mimo-v2.5-asr")
                .setTooltip(Component.literal("STT 模型名（默认 mimo-v2.5-asr）"))
                .setSaveConsumer(v -> VerityConfig.STT_BASE_MODEL.set(v))
                .build());
    }

    // ==================== 账户分类 ====================

    private static void buildAccountCategory(ConfigBuilder builder, ConfigEntryBuilder eb) {
        ConfigCategory cat = builder.getOrCreateCategory(Component.literal("账户"));

        // 账户操作按钮（点击立即执行，不等保存）
        cat.addEntry(new ButtonEntry(Component.literal("OAuth 登录"),
                Component.literal("§a▶ OAuth 登录"), 160,
                () -> { try { VerityAccountBridge.openLogin(); } catch (Throwable ignored) {} }));
        cat.addEntry(new ButtonEntry(Component.literal("刷新账户信息"),
                Component.literal("§e↻ 刷新信息"), 160,
                () -> { try { VerityAccountBridge.fetchFromConfig(); } catch (Throwable ignored) {} }));
        cat.addEntry(new ButtonEntry(Component.literal("连通性检测"),
                Component.literal("§b◆ 连通性检测"), 160,
                () -> { try { VerityAccountBridge.testAllModels(); } catch (Throwable ignored) {} }));
        cat.addEntry(new ButtonEntry(Component.literal("退出登录"),
                Component.literal("§c✖ 退出登录"), 160,
                () -> { try { VerityAccountBridge.logout(); } catch (Throwable ignored) {} }));

        // 账户信息子分组
        SubCategoryBuilder infoGroup = eb.startSubCategory(Component.literal("账户信息"));
        infoGroup.setExpanded(true);
        infoGroup.add(eb.startTextDescription(Component.literal("§7用户 ID: §f" + getStr(VerityConfig.VERITY_USER_ID.get())))
                .build());
        infoGroup.add(eb.startTextDescription(Component.literal("§7用户名: §f" + getStr(VerityConfig.VERITY_USERNAME.get())))
                .build());
        infoGroup.add(eb.startTextDescription(Component.literal("§7邮箱: §f" + getStr(VerityConfig.VERITY_EMAIL.get())))
                .build());
        infoGroup.add(eb.startTextDescription(Component.literal("§7积分余额: §f" + getStr(VerityConfig.VERITY_CREDITS.get())))
                .build());
        infoGroup.add(eb.startTextDescription(Component.literal("§7DeepSeek 余额: §f" + getStr(VerityConfig.VERITY_DS_BALANCE.get())))
                .build());
        cat.addEntry(infoGroup.build());

        // 模型信息子分组
        SubCategoryBuilder modelGroup = eb.startSubCategory(Component.literal("使用模型"));
        modelGroup.setTooltip(Component.literal("来自 Verity Mod 账户的模型配置及连通性状态。"));
        modelGroup.setExpanded(true);
        modelGroup.add(eb.startTextDescription(Component.literal("§7LLM 模型: §f" + getStr(VerityConfig.VERITY_SRV_LLM.get()) + getConnDisplay(VerityConfig.VERITY_CONN_LLM.get())))
                .build());
        modelGroup.add(eb.startTextDescription(Component.literal("§7TTS 模型: §f" + getStr(VerityConfig.VERITY_SRV_TTS.get()) + getConnDisplay(VerityConfig.VERITY_CONN_TTS.get())))
                .build());
        modelGroup.add(eb.startTextDescription(Component.literal("§7TTS 音色: §f" + getStr(VerityConfig.VERITY_SRV_TTS_VOICE.get())))
                .build());
        modelGroup.add(eb.startTextDescription(Component.literal("§7STT 模型: §f" + getStr(VerityConfig.VERITY_SRV_STT.get()) + getConnDisplay(VerityConfig.VERITY_CONN_STT.get())))
                .build());
        cat.addEntry(modelGroup.build());
    }

    // ==================== 辅助方法 ====================

    /** 扫描 config/verity/skins/ 目录获取皮肤列表，Verity 始终排第一 */
    private static String[] listSkins() {
        List<String> skins = new ArrayList<>();
        skins.add("Verity"); // 原版始终排第一
        try {
            Minecraft mc = Minecraft.getInstance();
            if (mc == null || mc.gameDirectory == null) return skins.toArray(new String[0]);
            Path skinsDir = mc.gameDirectory.toPath().resolve("config").resolve("verity").resolve("skins");
            File dir = skinsDir.toFile();
            if (!dir.exists()) {
                dir.mkdirs();
                return skins.toArray(new String[0]);
            }
            File[] zips = dir.listFiles((d, name) -> name.toLowerCase().endsWith(".zip"));
            if (zips == null) return skins.toArray(new String[0]);
            List<String> custom = new ArrayList<>();
            for (File zip : zips) {
                String name = zip.getName();
                name = name.substring(0, name.length() - 4); // 去掉 .zip
                if (!"Verity".equalsIgnoreCase(name)) {
                    custom.add(name);
                }
            }
            custom.sort(String.CASE_INSENSITIVE_ORDER);
            skins.addAll(custom);
        } catch (Throwable ignored) {}
        return skins.toArray(new String[0]);
    }

    /** 扫描 config/verity/sample_audio/ 目录获取样本音频列表 */
    private static String[] listCloneAudios() {
        List<String> audios = new ArrayList<>();
        try {
            Minecraft mc = Minecraft.getInstance();
            if (mc == null || mc.gameDirectory == null) return audios.toArray(new String[0]);
            Path audioDir = mc.gameDirectory.toPath().resolve("config").resolve("verity").resolve("sample_audio");
            File dir = audioDir.toFile();
            if (!dir.exists()) {
                dir.mkdirs();
                return audios.toArray(new String[0]);
            }
            File[] files = dir.listFiles((d, name) -> {
                String lower = name.toLowerCase();
                return lower.endsWith(".wav") || lower.endsWith(".mp3") || lower.endsWith(".flac")
                        || lower.endsWith(".ogg") || lower.endsWith(".m4a");
            });
            if (files == null) return audios.toArray(new String[0]);
            List<String> names = new ArrayList<>();
            for (File f : files) {
                names.add(f.getName());
            }
            names.sort(String.CASE_INSENSITIVE_ORDER);
            audios = names;
        } catch (Throwable ignored) {}
        return audios.toArray(new String[0]);
    }

    private static VerityVoice parseVoice(String name) {
        if (name == null || name.isEmpty()) return VerityVoice.DANIEL;
        try {
            return VerityVoice.valueOf(name.toUpperCase());
        } catch (Exception e) {
            return VerityVoice.DANIEL;
        }
    }

    private static String getConnDisplay(Object connObj) {
        String conn = getStr(connObj);
        // 空/未检测/默认状态：不显示任何标记
        if (conn == null || conn.isEmpty()) return "";
        if ("通过".equals(conn)) return " §a✓";
        if ("未配置".equals(conn) || "未登录".equals(conn) || "—".equals(conn)) return "";
        return " §c✗ " + conn;
    }

    private static String getStr(Object o) {
        if (o == null) return "";
        return o.toString();
    }

    /** 读取 DROP_ITEM_LEGACY_MODE */
    private static boolean getLegacyDropMode() {
        return varmite.verity.VerityModFlags.DROP_ITEM_LEGACY_MODE;
    }

    /** 设置 DROP_ITEM_LEGACY_MODE 并保存 */
    private static void setLegacyDropMode(boolean value) {
        varmite.verity.VerityModFlags.DROP_ITEM_LEGACY_MODE = value;
        varmite.verity.VerityModFlags.save();
    }

    /** 读取 FRIENDLY_MODE */
    private static boolean getFriendlyMode() {
        return varmite.verity.VerityModFlags.FRIENDLY_MODE;
    }

    /** 设置 FRIENDLY_MODE 并保存 */
    private static void setFriendlyMode(boolean value) {
        varmite.verity.VerityModFlags.FRIENDLY_MODE = value;
        varmite.verity.VerityModFlags.save();
    }
}
