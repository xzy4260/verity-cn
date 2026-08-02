package varmite.verity;

import java.io.*;
import java.nio.file.*;

/**
 * 独立的 Mod 标志位，不依赖 VerityConfig（避免修改 VerityConfig.class 的复杂性）。
 * 配置持久化到 config/verity-mod-flags.txt
 * 类加载时自动读取配置文件。
 */
public class VerityModFlags {
    public static boolean FRIENDLY_MODE = false;
    public static boolean DROP_ITEM_LEGACY_MODE = false;

    // 保留字段（唱歌功能已移除，但旧版 VerityClient.class 仍会引用，保留以避免 NoSuchFieldError）
    public static boolean MIMO_SING_ENABLED = false;
    public static boolean MIMO_SING_ENDPOINT_PAYASYOUGO = true;
    public static String MIMO_SING_API_KEY = "";

    private static final Path CONFIG_PATH = Paths.get("config", "verity-mod-flags.txt");

    static {
        load();
        // 加载后立即保存，清理旧版本残留的唱歌配置行
        save();
        System.out.println("[VerityModFlags] loaded: friendlyMode=" + FRIENDLY_MODE
                + ", dropItemLegacyMode=" + DROP_ITEM_LEGACY_MODE);
    }

    public static void load() {
        try {
            if (Files.exists(CONFIG_PATH)) {
                for (String line : Files.readAllLines(CONFIG_PATH)) {
                    line = line.trim();
                    if (line.startsWith("friendlyMode=")) {
                        FRIENDLY_MODE = Boolean.parseBoolean(line.substring("friendlyMode=".length()));
                    } else if (line.startsWith("dropItemLegacyMode=")) {
                        DROP_ITEM_LEGACY_MODE = Boolean.parseBoolean(line.substring("dropItemLegacyMode=".length()));
                    }
                }
            }
        } catch (Throwable t) {
            System.err.println("[VerityModFlags] load failed: " + t.getMessage());
        }
    }

    public static void save() {
        try {
            Files.createDirectories(CONFIG_PATH.getParent());
            Files.writeString(CONFIG_PATH,
                    "friendlyMode=" + FRIENDLY_MODE + "\n" +
                    "dropItemLegacyMode=" + DROP_ITEM_LEGACY_MODE + "\n");
            System.out.println("[VerityModFlags] saved: friendlyMode=" + FRIENDLY_MODE);
        } catch (Throwable t) {
            System.err.println("[VerityModFlags] save failed: " + t.getMessage());
        }
    }
}
