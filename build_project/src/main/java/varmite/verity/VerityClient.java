package varmite.verity;

import dev.isxander.yacl3.api.ConfigCategory;
import dev.isxander.yacl3.api.Option;
import dev.isxander.yacl3.api.OptionDescription;
import dev.isxander.yacl3.api.YetAnotherConfigLib;
import dev.isxander.yacl3.api.controller.EnumControllerBuilder;
import dev.isxander.yacl3.api.controller.IntegerSliderControllerBuilder;
import dev.isxander.yacl3.api.controller.StringControllerBuilder;
import dev.isxander.yacl3.api.controller.TickBoxControllerBuilder;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.network.chat.Style;
import net.minecraft.util.Mth;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.client.ConfigScreenHandler;
import net.minecraftforge.common.ForgeConfigSpec;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.ModLoadingContext;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import varmite.verity.client.VerityPreviewTexture;
import varmite.verity.event.ModBusClientSetup;

@Mod.EventBusSubscriber(modid = "verity", bus = Mod.EventBusSubscriber.Bus.MOD, value = {Dist.CLIENT})
public class VerityClient {

    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        IEventBus forgeBus = MinecraftForge.EVENT_BUS;
        forgeBus.addListener(ModBusClientSetup::registerRenderers);
        forgeBus.addListener(ModBusClientSetup::onModifyBakingResult);
        ModLoadingContext.get().registerExtensionPoint(
                ConfigScreenHandler.ConfigScreenFactory.class,
                () -> new ConfigScreenHandler.ConfigScreenFactory(
                        (minecraft, previousScreen) -> createYACLScreen(previousScreen)));
    }

    public static Screen createYACLScreen(Screen previousScreen) {
        boolean isAndroid = VerityPlatform.isAndroid();

        return YetAnotherConfigLib.createBuilder()
                .title(Component.literal("Verity 配置"))

                // ==================== 通用 ====================
                .category(ConfigCategory.createBuilder()
                        .name(Component.literal("通用"))
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("可被踢出"))
                                .description(OptionDescription.of(Component.literal("允许 Verity 将你踢出服务器")))
                                .binding(true, () -> (Boolean) VerityConfig.CAN_CRASH.get(),
                                        val -> VerityConfig.CAN_CRASH.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("开场动画"))
                                .description(OptionDescription.of(Component.literal("客户端启动时播放 Verity 开场动画")))
                                .binding(true, () -> (Boolean) VerityConfig.PLAY_VIDEO.get(),
                                        val -> VerityConfig.PLAY_VIDEO.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("必须喊名字"))
                                .description(OptionDescription.of(Component.literal("每句话中必须包含 'Verity' 才能与他交流")))
                                .binding(false, () -> (Boolean) VerityConfig.REQUIRE_VERITY.get(),
                                        val -> VerityConfig.REQUIRE_VERITY.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("极限黑暗"))
                                .description(OptionDescription.of(Component.literal("极限黑暗效果开关")))
                                .binding(true, () -> (Boolean) VerityConfig.TRUE_DARKNESS.get(),
                                        val -> VerityConfig.TRUE_DARKNESS.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("击杀村民"))
                                .description(OptionDescription.of(Component.literal("Verity 是否击杀村民")))
                                .binding(true, () -> (Boolean) VerityConfig.KILL_VILLAGERS.get(),
                                        val -> VerityConfig.KILL_VILLAGERS.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("显示 Karma 条"))
                                .description(OptionDescription.of(Component.literal("快捷栏上方显示 Karma 好感度条")))
                                .binding(true, () -> (Boolean) VerityConfig.SHOW_VERITYS_KARMA.get(),
                                        val -> VerityConfig.SHOW_VERITYS_KARMA.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<Integer>createBuilder()
                                .name(Component.literal("黑化天数"))
                                .description(OptionDescription.of(Component.literal("游戏天数达到此值后 Verity 变为恶魔形态")))
                                .binding(5, () -> (Integer) VerityConfig.DAY_COUNT.get(),
                                        val -> VerityConfig.DAY_COUNT.set(val))
                                .controller(opt -> IntegerSliderControllerBuilder.create(opt).range(1, 100).step(1))
                                .build())
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("沉浸模式"))
                                .description(OptionDescription.of(Component.literal("隐藏所有 Verity UI 和聊天消息")))
                                .binding(false, () -> (Boolean) VerityConfig.IMMERSIVE_MODE.get(),
                                        val -> VerityConfig.IMMERSIVE_MODE.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .build())

                // ==================== LLM ====================
                .category(ConfigCategory.createBuilder()
                        .name(Component.literal("LLM（大语言模型）"))
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("启用 LLM"))
                                .description(OptionDescription.of(Component.literal(
                                        "关闭后 Verity 将无法进行智能对话。\n国内推荐：DeepSeek、通义千问、硅基流动等")))
                                .binding(false, () -> (Boolean) VerityConfig.LLM_ENABLED.get(),
                                        val -> VerityConfig.LLM_ENABLED.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("Base URL"))
                                .description(OptionDescription.of(Component.literal(
                                        "API 基础地址（OpenAI 兼容格式）。例: https://api.deepseek.com/v1")))
                                .binding("https://api.deepseek.com/v1",
                                        () -> (String) VerityConfig.LLM_BASE_URL.get(),
                                        val -> VerityConfig.LLM_BASE_URL.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("API Key"))
                                .description(OptionDescription.of(Component.literal("API 密钥（sk-xxxxx 格式）")))
                                .binding("", () -> (String) VerityConfig.LLM_API_KEY.get(),
                                        val -> VerityConfig.LLM_API_KEY.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("模型名称"))
                                .description(OptionDescription.of(Component.literal(
                                        "例如: deepseek-chat, qwen-plus, glm-4-flash 等")))
                                .binding("deepseek-chat", () -> (String) VerityConfig.LLM_MODEL.get(),
                                        val -> VerityConfig.LLM_MODEL.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .build())

                // ==================== TTS ====================
                .category(ConfigCategory.createBuilder()
                        .name(Component.literal("TTS（文字转语音）"))
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("启用 TTS"))
                                .description(OptionDescription.of(Component.literal("总开关：是否让 Verity 说话")))
                                .binding(true, () -> (Boolean) VerityConfig.USE_TTS.get(),
                                        val -> VerityConfig.USE_TTS.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<TtsMode>createBuilder()
                                .name(Component.literal("TTS 模式"))
                                .description(OptionDescription.of(Component.literal(isAndroid
                                        ? "§e⚠ 安卓仅支持 MiMo API（云端语音合成）\n§7内置 Piper 引擎在安卓上不可用"
                                        : "内置TTS = 本地 Piper 引擎（离线）\nMiMo API = 小米语音合成")))
                                .binding(isAndroid ? TtsMode.MIMO : TtsMode.BUILT_IN,
                                        () -> (TtsMode) VerityConfig.TTS_MODE.get(),
                                        val -> VerityConfig.TTS_MODE.set(val))
                                .controller(opt -> EnumControllerBuilder.create(opt).enumClass(TtsMode.class))
                                .build())
                        .option(Option.<VerityVoice>createBuilder()
                                .name(Component.literal("内置 TTS 音色"))
                                .description(OptionDescription.of(Component.literal("Groq 云端 / 内置引擎的音色")))
                                .binding(VerityVoice.DANIEL,
                                        () -> {
                                            String v = (String) VerityConfig.TTS_BUILTIN_VOICE.get();
                                            try { return VerityVoice.valueOf(v.toUpperCase()); }
                                            catch (Exception e) { return VerityVoice.DANIEL; }
                                        },
                                        val -> VerityConfig.TTS_BUILTIN_VOICE.set(val.name()))
                                .controller(opt -> EnumControllerBuilder.create(opt).enumClass(VerityVoice.class))
                                .build())
                        // MiMo TTS 配置
                        .option(Option.<MimoApiEndpoint>createBuilder()
                                .name(Component.literal("MiMo API 端点"))
                                .description(OptionDescription.of(Component.literal(
                                        "按量付费: api.xiaomimimo.com\nToken Plan: token-plan-cn.xiaomimimo.com")))
                                .binding(MimoApiEndpoint.DEFAULT,
                                        () -> (MimoApiEndpoint) VerityConfig.TTS_MIMO_ENDPOINT.get(),
                                        val -> VerityConfig.TTS_MIMO_ENDPOINT.set(val))
                                .controller(opt -> EnumControllerBuilder.create(opt).enumClass(MimoApiEndpoint.class))
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("MiMo API Key"))
                                .description(OptionDescription.of(Component.literal("MiMo API 密钥（sk-xxxxx 或 tp-xxxxx）")))
                                .binding("", () -> (String) VerityConfig.TTS_MIMO_API_KEY.get(),
                                        val -> VerityConfig.TTS_MIMO_API_KEY.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("MiMo 音色"))
                                .description(OptionDescription.of(Component.literal(
                                        "模型固定 mimo-v2.5-tts。音色：冰糖/茉莉/苏打/白桦/Chloe/Mia/Milo/Dean")))
                                .binding("冰糖", () -> (String) VerityConfig.TTS_MIMO_VOICE.get(),
                                        val -> VerityConfig.TTS_MIMO_VOICE.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .build())

                // ==================== STT ====================
                .category(ConfigCategory.createBuilder()
                        .name(Component.literal("STT（语音识别）"))
                        .option(Option.<Boolean>createBuilder()
                                .name(Component.literal("启用 STT"))
                                .description(OptionDescription.of(Component.literal("总开关：是否启用语音识别（按下通话）")))
                                .binding(false, () -> (Boolean) VerityConfig.STT_ENABLED.get(),
                                        val -> VerityConfig.STT_ENABLED.set(val))
                                .controller(TickBoxControllerBuilder::create)
                                .build())
                        .option(Option.<SttMode>createBuilder()
                                .name(Component.literal("STT 模式"))
                                .description(OptionDescription.of(Component.literal(isAndroid
                                        ? "§e⚠ 安卓仅支持 MiMo API（云端语音识别）\n§7本地 Whisper 引擎在安卓上不可用"
                                        : "本地识别 = 离线 Whisper 引擎（英文）\nMiMo API = 小米语音识别（中英文）")))
                                .binding(isAndroid ? SttMode.MIMO : SttMode.LOCAL,
                                        () -> (SttMode) VerityConfig.STT_MODE.get(),
                                        val -> VerityConfig.STT_MODE.set(val))
                                .controller(opt -> EnumControllerBuilder.create(opt).enumClass(SttMode.class))
                                .build())
                        // MiMo STT 配置
                        .option(Option.<MimoApiEndpoint>createBuilder()
                                .name(Component.literal("MiMo API 端点"))
                                .description(OptionDescription.of(Component.literal(
                                        "按量付费: api.xiaomimimo.com\nToken Plan: token-plan-cn.xiaomimimo.com")))
                                .binding(MimoApiEndpoint.DEFAULT,
                                        () -> (MimoApiEndpoint) VerityConfig.STT_MIMO_ENDPOINT.get(),
                                        val -> VerityConfig.STT_MIMO_ENDPOINT.set(val))
                                .controller(opt -> EnumControllerBuilder.create(opt).enumClass(MimoApiEndpoint.class))
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("MiMo API Key"))
                                .description(OptionDescription.of(Component.literal(
                                        "MiMo API 密钥（sk-xxxxx 或 tp-xxxxx）。\n模型固定 mimo-v2.5-asr")))
                                .binding("", () -> (String) VerityConfig.STT_MIMO_API_KEY.get(),
                                        val -> VerityConfig.STT_MIMO_API_KEY.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .build())

                // ==================== 个性化 ====================
                .category(ConfigCategory.createBuilder()
                        .name(Component.literal("个性化"))
                        .option(Option.<Integer>createBuilder()
                                .name(Component.literal("纹理色调"))
                                .description(OptionDescription.of(Component.literal("Verity 纹理色调（0-360度，0=原始颜色）")))
                                .binding(0, () -> (Integer) VerityConfig.COLOR.get(),
                                        val -> {
                                            VerityConfig.COLOR.set(val);
                                            VerityPreviewTexture.applyHue(val);
                                        })
                                .controller(opt -> IntegerSliderControllerBuilder.create(opt).range(0, 360).step(1)
                                        .formatValue(value -> {
                                            if (value == 0) return Component.literal("0 (原始)");
                                            int rgb = Mth.color((float) value / 360.0f, 1.0f, 1.0f);
                                            return Component.literal("██ " + value).setStyle(Style.EMPTY.withColor(rgb));
                                        }))
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("自定义名称"))
                                .description(OptionDescription.of(Component.literal("给 Verity 起个新名字")))
                                .binding("Verity", () -> (String) VerityConfig.VERITY_CUSTOM_NAME.get(),
                                        val -> VerityConfig.VERITY_CUSTOM_NAME.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .option(Option.<String>createBuilder()
                                .name(Component.literal("性格"))
                                .description(OptionDescription.of(Component.literal("自定义 Verity 的性格")))
                                .binding("normal", () -> (String) VerityConfig.PERSONALITY.get(),
                                        val -> VerityConfig.PERSONALITY.set(val))
                                .controller(StringControllerBuilder::create)
                                .build())
                        .build())

                .build()
                .generateScreen(previousScreen);
    }
}
