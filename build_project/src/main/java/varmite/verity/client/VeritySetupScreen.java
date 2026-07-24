package varmite.verity.client;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.packs.resources.Resource;
import varmite.verity.VerityConfig;

import javax.imageio.ImageIO;
import java.util.Optional;

/**
 * Verity 初始化配置向导（非 YACL，原生 Screen）。
 *
 * 流程：
 *   0 授权询问 → 1 确保选模型(配图) → 2 5秒倒计时 → 3 等待OAuth(2分钟超时)
 *   → 4 失败(重试/跳过) → 5 检测模型 → 6 结果(全部通过/有失败刷新)
 *
 * 测试重置：左下角"重置向导"按钮调用 VerityFirstRun.reset()，下次启动重新弹出。
 * 也可手动删除 .minecraft/config/verity_setup_done 文件。
 */
public class VeritySetupScreen extends Screen {

    private static final int STEP_AUTHORIZE = 0;
    private static final int STEP_ENSURE_MODELS = 1;
    private static final int STEP_OAUTH_COUNTDOWN = 2;
    private static final int STEP_OAUTH_WAITING = 3;
    private static final int STEP_OAUTH_FAILED = 4;
    private static final int STEP_CHECKING_MODELS = 5;
    private static final int STEP_RESULT = 6;

    private static final int COUNTDOWN_SECONDS = 5;
    private static final ResourceLocation GUIDE_IMAGE =
            new ResourceLocation("verity", "textures/setup/guide.png");

    private final Screen previousScreen;
    private int step = STEP_AUTHORIZE;

    private long countdownStart = 0L;
    private boolean oauthStarted = false;
    private boolean checkingStarted = false;
    private long waitingDotTime = 0L;

    private int imgW = 0;
    private int imgH = 0;
    private boolean imgSizeLoaded = false;

    public VeritySetupScreen(Screen previous) {
        super(Component.literal("Verity 初始化配置"));
        this.previousScreen = previous;
    }

    @Override
    protected void init() {
        super.init();
        loadImageSize();
        rebuildButtons();
    }

    private void loadImageSize() {
        if (imgSizeLoaded) return;
        imgSizeLoaded = true;
        try {
            Optional<Resource> res = Minecraft.getInstance().getResourceManager().getResource(GUIDE_IMAGE);
            if (res.isPresent()) {
                try (var is = res.get().open()) {
                    var img = ImageIO.read(is);
                    if (img != null) {
                        imgW = img.getWidth();
                        imgH = img.getHeight();
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("[VeritySetup] loadImageSize: " + e.getMessage());
        }
    }

    private void rebuildButtons() {
        clearWidgets();
        int cx = this.width / 2;
        int btnY = this.height - 50;
        int btnW = 120;
        int gap = 8;

        switch (step) {
            case STEP_AUTHORIZE -> {
                addRenderableWidget(Button.builder(Component.literal("§a是"), b -> goStep(STEP_ENSURE_MODELS))
                        .bounds(cx - btnW - gap / 2, btnY, btnW, 20).build());
                addRenderableWidget(Button.builder(Component.literal("否"), b -> closeScreen())
                        .bounds(cx + gap / 2, btnY, btnW, 20).build());
            }
            case STEP_ENSURE_MODELS -> {
                int totalW = btnW * 3 + gap * 2;
                int startX = cx - totalW / 2;
                addRenderableWidget(Button.builder(Component.literal("§a是"), b -> {
                    countdownStart = System.currentTimeMillis();
                    oauthStarted = false;
                    goStep(STEP_OAUTH_COUNTDOWN);
                }).bounds(startX, btnY, btnW, 20).build());
                addRenderableWidget(Button.builder(Component.literal("否"), b -> goStep(STEP_AUTHORIZE))
                        .bounds(startX + btnW + gap, btnY, btnW, 20).build());
                addRenderableWidget(Button.builder(Component.literal("打开官网"), b ->
                        VeritySetupAuth.openBrowser("https://veritycn.site/"))
                        .bounds(startX + (btnW + gap) * 2, btnY, btnW, 20).build());
            }
            case STEP_OAUTH_COUNTDOWN -> {
                // 倒计时无按钮，自动推进
            }
            case STEP_OAUTH_WAITING -> {
                addRenderableWidget(Button.builder(Component.literal("取消"), b -> {
                    VeritySetupAuth.cancelOAuth();
                    closeScreen();
                }).bounds(cx - 60, btnY, 120, 20).build());
            }
            case STEP_OAUTH_FAILED -> {
                addRenderableWidget(Button.builder(Component.literal("再次尝试"), b -> {
                    countdownStart = System.currentTimeMillis();
                    oauthStarted = false;
                    goStep(STEP_OAUTH_COUNTDOWN);
                }).bounds(cx - btnW - gap / 2, btnY, btnW, 20).build());
                addRenderableWidget(Button.builder(Component.literal("跳过"), b -> closeScreen())
                        .bounds(cx + gap / 2, btnY, btnW, 20).build());
            }
            case STEP_CHECKING_MODELS -> {
                // 检测中无按钮，等待回调
            }
            case STEP_RESULT -> {
                if (isAllPass()) {
                    addRenderableWidget(Button.builder(Component.literal("§a完成"), b -> closeScreen())
                            .bounds(cx - 60, btnY, 120, 20).build());
                } else {
                    addRenderableWidget(Button.builder(Component.literal("刷新"), b -> {
                        checkingStarted = true;
                        goStep(STEP_CHECKING_MODELS);
                        startRecheckOnly();  // 直接触发检测，不依赖 tick
                    }).bounds(cx - btnW - gap / 2, btnY, btnW, 20).build());
                    addRenderableWidget(Button.builder(Component.literal("跳过"), b -> closeScreen())
                            .bounds(cx + gap / 2, btnY, btnW, 20).build());
                }
            }
        }
    }

    private void goStep(int s) {
        step = s;
        rebuildButtons();
    }

    private boolean isAllPass() {
        return "通过".equals(VerityConfig.VERITY_CONN_LLM.get())
                && "通过".equals(VerityConfig.VERITY_CONN_TTS.get())
                && "通过".equals(VerityConfig.VERITY_CONN_STT.get());
    }

    private void closeScreen() {
        VeritySetupAuth.cancelOAuth();
        Minecraft.getInstance().setScreen(previousScreen);
    }

    /** 启动 OAuth，成功后拉账户信息→检测模型→进结果页 */
    private void startOAuthAndCheck() {
        VeritySetupAuth.startOAuth(licenseKey -> {
            // 成功（后台线程）：验证 licenseKey 非空
            if (licenseKey == null || licenseKey.isEmpty()) {
                System.out.println("[VeritySetup] OAuth returned empty licenseKey, treat as failure");
                Minecraft.getInstance().execute(() -> goStep(STEP_OAUTH_FAILED));
                return;
            }
            // 先切到检测中界面，再异步拉信息+检测
            Minecraft.getInstance().execute(() -> {
                checkingStarted = true;  // 标记已启动检测，防止 tick 重复触发
                goStep(STEP_CHECKING_MODELS);
            });
            // 直接用回调传入的 licenseKey，避免依赖 VERITY_BRIDGE_KEY 配置写入时序
            VeritySetupAuth.fetchInfo(licenseKey, () ->
                    VeritySetupAuth.testModels(licenseKey, () ->
                            Minecraft.getInstance().execute(() -> goStep(STEP_RESULT))));
        }, reason -> {
            // 失败/超时（后台线程）
            Minecraft.getInstance().execute(() -> goStep(STEP_OAUTH_FAILED));
        });
    }

    /** 仅刷新检测（用于结果页"刷新"按钮）。调用前必须已设置 checkingStarted=true。 */
    private void startRecheckOnly() {
        String key = (String) VerityConfig.VERITY_BRIDGE_KEY.get();
        if (key == null || key.isEmpty()) {
            Minecraft.getInstance().execute(this::goResultDirect);
            return;
        }
        VeritySetupAuth.fetchInfo(key, () ->
                VeritySetupAuth.testModels(key, () ->
                        Minecraft.getInstance().execute(this::goResultDirect)));
    }

    private void goResultDirect() {
        goStep(STEP_RESULT);
    }

    @Override
    public void tick() {
        if (step == STEP_OAUTH_COUNTDOWN) {
            long elapsed = System.currentTimeMillis() - countdownStart;
            if (elapsed >= COUNTDOWN_SECONDS * 1000L) {
                goStep(STEP_OAUTH_WAITING);
            }
        }
        if (step == STEP_OAUTH_WAITING && !oauthStarted) {
            oauthStarted = true;
            startOAuthAndCheck();
        }
        // 注意：STEP_CHECKING_MODELS 状态下不在此触发检测。
        // OAuth 成功路径（startOAuthAndCheck）和刷新按钮会自行驱动 fetchInfo→testModels，
        // 在此触发会因 VERITY_BRIDGE_KEY 还没写入而直接跳结果页显示"--/未登录"。
        waitingDotTime = System.currentTimeMillis();
    }

    @Override
    public void render(GuiGraphics gg, int mouseX, int mouseY, float partialTick) {
        renderBackground(gg);
        int cx = this.width / 2;
        switch (step) {
            case STEP_AUTHORIZE -> renderAuthorize(gg, cx);
            case STEP_ENSURE_MODELS -> renderEnsureModels(gg, cx);
            case STEP_OAUTH_COUNTDOWN -> renderOauthCountdown(gg, cx);
            case STEP_OAUTH_WAITING -> renderOauthWaiting(gg, cx);
            case STEP_OAUTH_FAILED -> renderOauthFailed(gg, cx);
            case STEP_CHECKING_MODELS -> renderChecking(gg, cx);
            case STEP_RESULT -> renderResult(gg, cx);
        }
        super.render(gg, mouseX, mouseY, partialTick);
    }

    private void drawTitle(GuiGraphics gg, int cx, int y, String text) {
        gg.drawCenteredString(this.font, Component.literal("§e§l" + text), cx, y, 0xFFFFFF);
    }

    private void drawCenter(GuiGraphics gg, int cx, int y, String text, int color) {
        gg.drawCenteredString(this.font, Component.literal(text), cx, y, color);
    }

    private void renderAuthorize(GuiGraphics gg, int cx) {
        int y = this.height / 2 - 50;
        drawTitle(gg, cx, y, "Verity Mod 初始化配置");
        y += 36;
        drawCenter(gg, cx, y, "是否进行 Verity Mod 授权？", 0xFFFFFF);
        y += 14;
        drawCenter(gg, cx, y, "§7授权后使用更简易，事后可在配置页手动分配", 0xAAAAAA);
    }

    private void renderEnsureModels(GuiGraphics gg, int cx) {
        int y = 18;
        drawTitle(gg, cx, y, "请确保你已在网站选择模型");
        y += 18;
        drawCenter(gg, cx, y, "§7Verity Mod 网站 → 代理服务 → 提供商 → 模型 至少选择一次", 0xAAAAAA);
        y += 12;
        renderGuideImage(gg, cx, y);
    }

    private void renderGuideImage(GuiGraphics gg, int cx, int y) {
        int availH = this.height - y - 70;
        int availW = this.width - 40;
        if (imgW <= 0 || imgH <= 0) {
            // 未知尺寸，按 16:9 渲染
            imgW = 16;
            imgH = 9;
        }
        int drawW = Math.min(availW, 640);
        int drawH = drawW * imgH / imgW;
        if (drawH > availH) {
            drawH = availH;
            drawW = drawH * imgW / imgH;
        }
        int drawX = cx - drawW / 2;
        // 1.20.1 GuiGraphics.blit(ResourceLocation, int x, int y, int u, int v, int w, int h, int texW, int texH)
        gg.blit(GUIDE_IMAGE, drawX, y, 0, 0, drawW, drawH, drawW, drawH);
    }

    private void renderOauthCountdown(GuiGraphics gg, int cx) {
        int y = this.height / 2 - 20;
        drawTitle(gg, cx, y, "即将打开授权");
        y += 36;
        long elapsed = System.currentTimeMillis() - countdownStart;
        long remain = Math.max(0, COUNTDOWN_SECONDS - elapsed / 1000);
        drawCenter(gg, cx, y, "§f" + remain + " 秒后尝试打开 Verity Mod OAuth…", 0xFFFFFF);
        y += 16;
        drawCenter(gg, cx, y, "§7请授权令牌", 0xAAAAAA);
    }

    private void renderOauthWaiting(GuiGraphics gg, int cx) {
        int y = this.height / 2 - 20;
        drawTitle(gg, cx, y, "等待授权");
        y += 36;
        int dots = (int) ((waitingDotTime / 500L) % 4);
        StringBuilder sb = new StringBuilder("正在等待授权完成");
        for (int i = 0; i < dots; i++) sb.append(".");
        drawCenter(gg, cx, y, "§f" + sb, 0xFFFFFF);
        y += 16;
        drawCenter(gg, cx, y, "§7请在浏览器完成授权（超时 2 分钟）", 0xAAAAAA);
    }

    private void renderOauthFailed(GuiGraphics gg, int cx) {
        int y = this.height / 2 - 30;
        drawCenter(gg, cx, y, "§c§l授权失败", 0xFFFFFF);
        y += 30;
        drawCenter(gg, cx, y, "§f2 分钟内未完成授权", 0xFFFFFF);
        y += 14;
        drawCenter(gg, cx, y, "§7请再次尝试或跳过", 0xAAAAAA);
    }

    private void renderChecking(GuiGraphics gg, int cx) {
        int y = this.height / 2 - 10;
        drawTitle(gg, cx, y, "正在检测模型连通性");
        y += 36;
        int dots = (int) ((waitingDotTime / 500L) % 4);
        StringBuilder sb = new StringBuilder("检测中");
        for (int i = 0; i < dots; i++) sb.append(".");
        drawCenter(gg, cx, y, "§f" + sb, 0xFFFFFF);
    }

    private void renderResult(GuiGraphics gg, int cx) {
        int y = 16;
        drawTitle(gg, cx, y, "初始化配置结果");
        y += 22;

        // 账户信息
        drawCenter(gg, cx, y, "§6账户信息", 0xFFFFFF);
        y += 14;
        int leftX = cx - 110;
        int valX = cx - 30;
        y = drawRow(gg, y, leftX, valX, "用户名", getStr(VerityConfig.VERITY_USERNAME.get()));
        y = drawRow(gg, y, leftX, valX, "邮箱", getStr(VerityConfig.VERITY_EMAIL.get()));
        y = drawRow(gg, y, leftX, valX, "积分余额", getStr(VerityConfig.VERITY_CREDITS.get()));
        y = drawRow(gg, y, leftX, valX, "DeepSeek 余额", getStr(VerityConfig.VERITY_DS_BALANCE.get()));

        y += 6;
        drawCenter(gg, cx, y, "§6模型配置", 0xFFFFFF);
        y += 14;
        y = drawModelRow(gg, y, leftX, valX, "LLM 模型",
                getStr(VerityConfig.VERITY_SRV_LLM.get()), getStr(VerityConfig.VERITY_CONN_LLM.get()));
        y = drawModelRow(gg, y, leftX, valX, "TTS 模型",
                getStr(VerityConfig.VERITY_SRV_TTS.get()), getStr(VerityConfig.VERITY_CONN_TTS.get()));
        y = drawRow(gg, y, leftX, valX, "TTS 音色", getStr(VerityConfig.VERITY_SRV_TTS_VOICE.get()));
        y = drawModelRow(gg, y, leftX, valX, "STT 模型",
                getStr(VerityConfig.VERITY_SRV_STT.get()), getStr(VerityConfig.VERITY_CONN_STT.get()));

        y += 8;
        boolean allPass = isAllPass();
        if (allPass) {
            drawCenter(gg, cx, y, "§a§l恭喜，你完成了初始化配置，可以进行游戏了！", 0xFFFFFF);
            y += 14;
            drawCenter(gg, cx, y, "§7如需刷新配置请前往 Mods → Verity Forge → 配置 → Verity Mod 账户", 0xAAAAAA);
        } else {
            drawCenter(gg, cx, y, "§c模型检测有一项未通过", 0xFFFFFF);
            y += 14;
            drawCenter(gg, cx, y, "§7请检查账户余额（DeepSeek 余额和积分余额）是否充足", 0xAAAAAA);
            y += 12;
            drawCenter(gg, cx, y, "§7是否选择为免费模型（免费额度耗尽将不可用）", 0xAAAAAA);
        }
    }

    private int drawRow(GuiGraphics gg, int y, int leftX, int valX, String label, String value) {
        gg.drawString(this.font, Component.literal("§7" + label + ": "), leftX, y, 0xFFFFFF);
        gg.drawString(this.font, Component.literal("§f" + value), valX, y, 0xFFFFFF);
        return y + 12;
    }

    private int drawModelRow(GuiGraphics gg, int y, int leftX, int valX, String label, String model, String conn) {
        gg.drawString(this.font, Component.literal("§7" + label + ": "), leftX, y, 0xFFFFFF);
        gg.drawString(this.font, Component.literal("§f" + model), valX, y, 0xFFFFFF);
        String connDisplay;
        if ("通过".equals(conn)) connDisplay = "§a✓ " + conn;
        else if ("未配置".equals(conn) || "未登录".equals(conn)) connDisplay = "§7" + conn;
        else connDisplay = "§c✗ " + conn;
        gg.drawString(this.font, Component.literal(connDisplay), valX + 160, y, 0xFFFFFF);
        return y + 12;
    }

    private String getStr(Object o) {
        if (o == null) return "—";
        String s = o.toString();
        return s.isEmpty() ? "—" : s;
    }

    @Override
    public boolean shouldCloseOnEsc() {
        return false;
    }

    @Override
    public boolean keyPressed(int keyCode, int scanCode, int modifiers) {
        if (keyCode == 256) {
            closeScreen();
            return true;
        }
        return super.keyPressed(keyCode, scanCode, modifiers);
    }

    @Override
    public void removed() {
        VeritySetupAuth.cancelOAuth();
        super.removed();
    }
}
