package varmite.verity;

import net.minecraftforge.common.ForgeConfigSpec;

/**
 * Verity 模组配置文件
 * 所有 AI 相关配置重新整理为三大板块：LLM / TTS / STT
 */
public class VerityConfig {
    public static final ForgeConfigSpec SPEC;

    // ========== 通用配置 ==========
    public static final ForgeConfigSpec.BooleanValue CAN_CRASH;
    public static final ForgeConfigSpec.BooleanValue PLAY_VIDEO;
    public static final ForgeConfigSpec.BooleanValue REQUIRE_VERITY;
    public static final ForgeConfigSpec.BooleanValue TRUE_DARKNESS;
    public static final ForgeConfigSpec.BooleanValue KILL_VILLAGERS;
    public static final ForgeConfigSpec.BooleanValue SHOW_VERITYS_KARMA;
    public static final ForgeConfigSpec.ConfigValue<Integer> DAY_COUNT;
    public static final ForgeConfigSpec.ConfigValue<Integer> COLOR;
    public static final ForgeConfigSpec.ConfigValue<String> VERITY_CUSTOM_NAME;
    public static final ForgeConfigSpec.ConfigValue<String> PERSONALITY;
    public static final ForgeConfigSpec.BooleanValue USE_TTS;
    public static final ForgeConfigSpec.BooleanValue IMMERSIVE_MODE;

    // ========== LLM 配置 ==========
    public static final ForgeConfigSpec.BooleanValue LLM_ENABLED;
    public static final ForgeConfigSpec.ConfigValue<String> LLM_BASE_URL;
    public static final ForgeConfigSpec.ConfigValue<String> LLM_API_KEY;
    public static final ForgeConfigSpec.ConfigValue<String> LLM_MODEL;

    // ========== TTS 配置 ==========
    public static final ForgeConfigSpec.EnumValue<TtsMode> TTS_MODE;
    public static final ForgeConfigSpec.ConfigValue<String> TTS_BUILTIN_VOICE;
    // MiMo TTS
    public static final ForgeConfigSpec.EnumValue<MimoApiEndpoint> TTS_MIMO_ENDPOINT;
    public static final ForgeConfigSpec.ConfigValue<String> TTS_MIMO_API_KEY;
    public static final ForgeConfigSpec.ConfigValue<String> TTS_MIMO_VOICE;

    // ========== STT 配置 ==========
    public static final ForgeConfigSpec.BooleanValue STT_ENABLED;
    public static final ForgeConfigSpec.EnumValue<SttMode> STT_MODE;
    // MiMo STT
    public static final ForgeConfigSpec.EnumValue<MimoApiEndpoint> STT_MIMO_ENDPOINT;
    public static final ForgeConfigSpec.ConfigValue<String> STT_MIMO_API_KEY;

    // ========== 旧字段兼容（保留以维持其他代码不报错，实际不再使用） ==========
    public static final ForgeConfigSpec.EnumValue<AiModel> AI_MODEL;
    public static final ForgeConfigSpec.EnumValue<AiProvider> AI_PROVIDER;
    public static final ForgeConfigSpec.ConfigValue<String> API_KEY;
    public static final ForgeConfigSpec.ConfigValue<String> VOICE;
    public static final ForgeConfigSpec.BooleanValue USE_LOCAL_TTS;
    public static final ForgeConfigSpec.BooleanValue USE_LOCAL_STT;
    public static final ForgeConfigSpec.BooleanValue USE_OLLAMA;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_URL;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_AI_MODEL;
    public static final ForgeConfigSpec.BooleanValue USE_KOKORO;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_TTS_URL;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_TTS_MODEL;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_TTS_VOICE;
    public static final ForgeConfigSpec.BooleanValue USE_LOCAL_WHISPER;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_STT_URL;
    public static final ForgeConfigSpec.ConfigValue<String> OLLAMA_STT_MODEL;
    public static final ForgeConfigSpec.BooleanValue THINKING_MODE;
    public static final ForgeConfigSpec.BooleanValue USE_NATIVE_TTS;

    static {
        ForgeConfigSpec.Builder builder = new ForgeConfigSpec.Builder();

        // ===================== 通用配置 =====================
        builder.push("通用");
        CAN_CRASH = builder
                .comment("允许 Verity 将你踢出服务器")
                .define("canCrash", true);
        PLAY_VIDEO = builder
                .comment("客户端启动时播放 Verity 开场动画")
                .define("playVideo", true);
        REQUIRE_VERITY = builder
                .comment("每句话中必须包含'Verity'才能与他交流")
                .define("requireVerity", false);
        TRUE_DARKNESS = builder
                .comment("极限黑暗效果开关")
                .define("trueDarkness", true);
        KILL_VILLAGERS = builder
                .comment("Verity 是否击杀村民")
                .define("killVillagers", true);
        SHOW_VERITYS_KARMA = builder
                .comment("快捷栏上方显示 Karma 条")
                .define("showKarma", true);
        DAY_COUNT = builder
                .comment("游戏天数达到此值后 Verity 变为敌对/恶魔形态")
                .define("dayCount", 5);
        IMMERSIVE_MODE = builder
                .comment("沉浸模式：隐藏所有 Verity UI（服务器开启时也会隐藏聊天）")
                .define("immersiveMode", false);
        builder.pop();

        builder.push("个性化");
        COLOR = builder
                .comment("Verity 纹理色调（0-360度，0=原始颜色）")
                .defineInRange("colorHue", 0, 0, 360);
        VERITY_CUSTOM_NAME = builder
                .comment("Verity 的自定义名称，留空则使用默认'Verity'")
                .define("customName", "Verity");
        PERSONALITY = builder
                .comment("Verity 的自定义性格")
                .define("customPersonality", "normal");
        builder.pop();

        // ===================== LLM 配置 =====================
        builder.push("LLM（大语言模型）");
        LLM_ENABLED = builder
                .comment("启用 LLM AI 对话功能。关闭后 Verity 将无法进行智能对话")
                .define("llmEnabled", false);
        LLM_BASE_URL = builder
                .comment("API 基础地址（OpenAI 兼容接口）。国内推荐：DeepSeek、通义千问、硅基流动等")
                .define("llmBaseUrl", "https://api.deepseek.com/v1");
        LLM_API_KEY = builder
                .comment("API 密钥")
                .define("llmApiKey", "");
        LLM_MODEL = builder
                .comment("模型名称，例如 deepseek-chat、qwen-plus 等")
                .define("llmModel", "deepseek-chat");
        builder.pop();

        // ===================== TTS 配置 =====================
        builder.push("TTS（文字转语音）");
        USE_TTS = builder
                .comment("总开关：是否启用语音播报")
                .define("ttsEnabled", true);
        TTS_MODE = builder
                .comment("TTS 模式：内置TTS（本地 Piper 引擎）/ 系统TTS（操作系统旁白）/ MiMo API（小米语音合成）")
                .defineEnum("ttsMode", TtsMode.BUILT_IN);

        builder.push("内置TTS音色");
        TTS_BUILTIN_VOICE = builder
                .comment("内置 Piper 引擎的音色选择（英文语音）")
                .define("ttsBuiltinVoice", "en_US-ryan-medium");
        builder.pop();

        builder.push("MiMo TTS 配置");
        TTS_MIMO_ENDPOINT = builder
                .comment("API 端点：按量付费 或 Token Plan 订阅")
                .defineEnum("ttsMimoEndpoint", MimoApiEndpoint.DEFAULT);
        TTS_MIMO_API_KEY = builder
                .comment("MiMo API 密钥（sk-xxxxx 或 tp-xxxxx）")
                .define("ttsMimoApiKey", "");
        TTS_MIMO_VOICE = builder
                .comment("MiMo TTS 音色名称（如：冰糖、茉莉、苏打、白桦、Chloe 等）")
                .define("ttsMimoVoice", "冰糖");
        builder.pop();
        builder.pop();

        // ===================== STT 配置 =====================
        builder.push("STT（语音识别）");
        STT_ENABLED = builder
                .comment("总开关：是否启用语音识别（按下通话）")
                .define("sttEnabled", false);
        STT_MODE = builder
                .comment("STT 模式：本地识别（离线 Whisper 引擎）/ MiMo API（小米语音识别）")
                .defineEnum("sttMode", SttMode.LOCAL);

        builder.push("MiMo STT 配置");
        STT_MIMO_ENDPOINT = builder
                .comment("API 端点：按量付费 或 Token Plan 订阅")
                .defineEnum("sttMimoEndpoint", MimoApiEndpoint.DEFAULT);
        STT_MIMO_API_KEY = builder
                .comment("MiMo API 密钥（sk-xxxxx 或 tp-xxxxx）")
                .define("sttMimoApiKey", "");
        builder.pop();
        builder.pop();

        // ===================== 旧字段（兼容占位，不再显示在 GUI 中） =====================
        builder.push("_legacy");
        API_KEY = builder.define("apiKey", "");
        AI_MODEL = builder.defineEnum("aiModel", AiModel.FAST);
        AI_PROVIDER = builder.defineEnum("aiProvider", AiProvider.GROQ);
        VOICE = builder.define("voice", "Daniel");
        USE_LOCAL_TTS = builder.define("useLocalTts", true);
        USE_LOCAL_STT = builder.define("useLocalStt", false);
        USE_OLLAMA = builder.define("use_ollama", false);
        OLLAMA_URL = builder.define("ollama_url", "http://127.0.0.1:4000/v1/");
        OLLAMA_AI_MODEL = builder.define("ollama_ai_model", "ollama/qwen2.5:1.5b");
        USE_KOKORO = builder.define("use_kokoro", false);
        OLLAMA_TTS_URL = builder.define("ollama_tts_url", "http://127.0.0.1:8880/v1/");
        OLLAMA_TTS_MODEL = builder.define("ollama_tts_model", "kokoro");
        OLLAMA_TTS_VOICE = builder.define("ollama_tts_voice", "am_fenrir");
        USE_LOCAL_WHISPER = builder.define("use_local_whisper", false);
        OLLAMA_STT_URL = builder.define("ollama_stt_url", "http://127.0.0.1:9000/v1/");
        OLLAMA_STT_MODEL = builder.define("ollama_stt_model", "models/ggml-large-v3-turbo.bin");
        THINKING_MODE = builder.define("thinking_mode", false);
        USE_NATIVE_TTS = builder.define("useNativeTts", false);
        builder.pop();

        SPEC = builder.build();
    }
}
