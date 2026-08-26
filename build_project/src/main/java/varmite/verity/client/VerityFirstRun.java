package varmite.verity.client;

import java.nio.file.Files;
import java.nio.file.Path;
import net.minecraftforge.fml.loading.FMLPaths;

/**
 * 首次运行检测：通过标记文件判断是否已完成初始化向导。
 *
 * 重置方法（测试用）：手动删除 .minecraft/config/verity_setup_done 文件，下次启动将重新弹出向导。
 *
 * 注意：用 FMLPaths 而非 Minecraft.getInstance()，因为后者在 SRG 运行时是 m_91087_，
 * 用 official mappings 编译的方法名不匹配会 NoSuchMethodError。FMLPaths 是 forge API，不混淆。
 */
public class VerityFirstRun {
    private static final String MARKER_FILE = "verity_setup_done";

    public static boolean isFirstRun() {
        try {
            return !Files.exists(getMarkerPath());
        } catch (Exception e) {
            return true;
        }
    }

    public static void markComplete() {
        try {
            Path marker = getMarkerPath();
            Files.createDirectories(marker.getParent());
            Files.write(marker, new byte[]{1});
        } catch (Exception e) {
            System.out.println("[Verity] markComplete error: " + e.getMessage());
        }
    }

    private static Path getMarkerPath() {
        // FMLPaths.CONFIGDIR 已是 <gameDir>/config，标记文件直接放其下
        return FMLPaths.CONFIGDIR.get().resolve(MARKER_FILE);
    }
}
