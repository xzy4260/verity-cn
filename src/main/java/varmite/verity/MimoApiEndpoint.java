package varmite.verity;

/**
 * MiMo API 端点类型
 * DEFAULT    - 按量付费: https://api.xiaomimimo.com/v1
 * TOKEN_PLAN - 订阅制:   https://token-plan-cn.xiaomimimo.com/v1
 */
public enum MimoApiEndpoint {
    DEFAULT("按量付费", "https://api.xiaomimimo.com/v1"),
    TOKEN_PLAN("Token Plan", "https://token-plan-cn.xiaomimimo.com/v1");

    private final String displayName;
    private final String baseUrl;

    MimoApiEndpoint(String displayName, String baseUrl) {
        this.displayName = displayName;
        this.baseUrl = baseUrl;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public String getBaseUrl() {
        return this.baseUrl;
    }
}
