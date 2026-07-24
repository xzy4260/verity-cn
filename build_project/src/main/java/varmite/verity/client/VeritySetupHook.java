package varmite.verity.client;

import net.minecraft.client.gui.screens.Screen;

/**
 * 初始化向导的 Hook 入口。
 *
 * 触发点：ModClientEvents.onScreenOpen 中检测到 TitleScreen 首次显示时。
 * 调用 onTitleScreen(event.getScreen())：
 *   - 首次运行：标记完成并返回 VeritySetupScreen
 *   - 非首次运行：返回原屏幕（null 表示不替换）
 *
 * 同时保留 getDestination() 供 IntroVideoScreen.skip() 调用（playVideo=true 路径）。
 */
public class VeritySetupHook {

    /** TitleScreen 首次显示时的入口，返回应替换的 Screen，null 表示不替换 */
    public static Screen onTitleScreen(Screen original) {
        if (VerityFirstRun.isFirstRun()) {
            VerityFirstRun.markComplete();
            return new VeritySetupScreen(original);
        }
        return null;
    }

    /** IntroVideoScreen.skip() 路径（playVideo=true 时）：首次运行返回向导，否则返回原屏幕 */
    public static Screen getDestination(Screen previous) {
        // playVideo 路径下，向导已在 onTitleScreen 触发并标记完成，这里不再二次触发
        return previous;
    }
}
