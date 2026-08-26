package varmite.verity;

/**
 * TTS 模式枚举
 * BUILT_IN  - 内置 Piper 本地引擎
 * SYSTEM    - 操作系统旁白
 * MIMO      - 小米 MiMo API
 */
public enum TtsMode {
    BUILT_IN("内置TTS"),
    SYSTEM("系统TTS"),
    MIMO("MiMo API");

    private final String displayName;

    TtsMode(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return this.displayName;
    }
}
