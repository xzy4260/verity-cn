package varmite.verity;

/**
 * STT（语音识别）模式枚举
 * LOCAL - 本地 Whisper 引擎（Sherpa-ONNX）
 * MIMO  - 小米 MiMo ASR API
 */
public enum SttMode {
    LOCAL("本地识别"),
    MIMO("MiMo API");

    private final String displayName;

    SttMode(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return this.displayName;
    }
}
