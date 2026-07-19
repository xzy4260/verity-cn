package varmite.verity;

import com.mojang.blaze3d.audio.OggAudioStream;
import net.minecraft.client.Minecraft;
import org.lwjgl.openal.AL10;
import org.lwjgl.openal.ALC10;
import org.lwjgl.openal.ALCCapabilities;

import javax.sound.sampled.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;
import java.util.concurrent.CompletableFuture;

/**
 * 跨平台音频工具
 * 桌面：javax.sound.sampled
 * 安卓：LWJGL OpenAL（PojavLauncher 已适配）
 */
public class VerityPlatform {

    private static final boolean IS_ANDROID;

    static {
        String vendor = System.getProperty("java.vendor", "");
        String osName = System.getProperty("os.name", "");
        String javaRuntime = System.getProperty("java.runtime.name", "");
        String userHome = System.getProperty("user.home", "");
        String javaLibPath = System.getProperty("java.library.path", "");

        IS_ANDROID = vendor.contains("Android")
                || osName.contains("Android")
                || javaRuntime.contains("Android")
                || userHome.contains("/storage/emulated/")
                || userHome.contains("/data/data/")
                || javaLibPath.contains("/data/app/")
                || isAndroidLauncher();
    }

    private static boolean isAndroidLauncher() {
        // PojavLauncher / FCL / Zalith / HMCL-PE 等启动器
        String[] launchers = {
            "net.kdt.pojavlaunch.PojavLoginActivity",          // PojavLauncher
            "com.movtery.pojavlauncher.PojavLauncherActivity",  // FCL / Zalith
            "com.movtery.zalithlauncher.ZalithLauncherActivity",// ZalithLauncher
            "com.movtery.fcl.FCLApplication",                   // Fold Craft Launcher
            "com.mojang.minecraftpe.MainActivity",              // 原版 PE (fallback)
        };
        for (String cls : launchers) {
            try {
                Class.forName(cls);
                return true;
            } catch (Exception ignored) {}
        }
        return false;
    }

    public static boolean isAndroid() {
        return IS_ANDROID;
    }

    // ==================== PCM 音频播放（跨平台） ====================

    /**
     * 播放 16kHz 16-bit mono PCM 音频
     */
    public static void playPCMAudio(byte[] pcmData, int sampleRate) {
        if (pcmData == null || pcmData.length == 0) return;
        if (IS_ANDROID) {
            playPCMviaOpenAL(pcmData, sampleRate);
        } else {
            playPCMviaJavaSound(pcmData, sampleRate);
        }
    }

    /**
     * 桌面：javax.sound
     */
    private static void playPCMviaJavaSound(byte[] pcmData, int sampleRate) {
        try {
            AudioFormat format = new AudioFormat(sampleRate, 16, 1, true, false);
            DataLine.Info info = new DataLine.Info(SourceDataLine.class, format);
            SourceDataLine line = (SourceDataLine) AudioSystem.getLine(info);
            line.open(format);
            line.start();
            line.write(pcmData, 0, pcmData.length);
            line.drain();
            line.close();
        } catch (Exception e) {
            System.out.println("[Verity Audio] JavaSound playback failed: " + e.getMessage());
        }
    }

    /**
     * 安卓：LWJGL OpenAL（GPU 线程）
     */
    private static void playPCMviaOpenAL(byte[] pcmData, int sampleRate) {
        System.out.println("[Verity Audio] playPCMviaOpenAL | pcm=" + pcmData.length
                + " | sampleRate=" + sampleRate + " | thread=" + Thread.currentThread().getName());
        Minecraft.getInstance().execute(() -> {
            System.out.println("[Verity Audio] OpenAL on render thread, starting");
            try {
                int buffer = AL10.alGenBuffers();
                int err1 = AL10.alGetError();
                System.out.println("[Verity Audio] alGenBuffers=" + buffer + " err=" + err1);
                if (err1 != AL10.AL_NO_ERROR) return;

                ShortBuffer shortBuf = ByteBuffer.wrap(pcmData)
                        .order(ByteOrder.LITTLE_ENDIAN).asShortBuffer();
                short[] samples = new short[shortBuf.remaining()];
                shortBuf.get(samples);
                ByteBuffer nativeBuf = ByteBuffer.allocateDirect(pcmData.length);
                nativeBuf.order(ByteOrder.nativeOrder());
                nativeBuf.asShortBuffer().put(samples);

                AL10.alBufferData(buffer, AL10.AL_FORMAT_MONO16, nativeBuf, sampleRate);
                int err2 = AL10.alGetError();
                System.out.println("[Verity Audio] alBufferData size=" + pcmData.length + " err=" + err2);
                if (err2 != AL10.AL_NO_ERROR) return;

                int source = AL10.alGenSources();
                AL10.alSourcei(source, AL10.AL_BUFFER, buffer);
                // 关键：设为相对音源（不受玩家位置/距离影响）
                AL10.alSourcei(source, AL10.AL_SOURCE_RELATIVE, AL10.AL_TRUE);
                // 显式设置音量 1.0
                AL10.alSourcef(source, AL10.AL_GAIN, 1.0f);
                AL10.alSourcef(source, AL10.AL_PITCH, 1.0f);
                AL10.alSourcePlay(source);
                int err3 = AL10.alGetError();
                System.out.println("[Verity Audio] alSourcePlay source=" + source + " err=" + err3);

                long durationMs = (long) pcmData.length * 1000L / (sampleRate * 2L);
                CompletableFuture.runAsync(() -> {
                    try { Thread.sleep(Math.max(500, durationMs + 200)); } catch (Exception e) {}
                    Minecraft.getInstance().execute(() -> {
                        try {
                            AL10.alSourceStop(source);
                            AL10.alDeleteSources(source);
                            AL10.alDeleteBuffers(buffer);
                        } catch (Exception ignored) {}
                    });
                });
            } catch (Exception e) {
                System.out.println("[Verity Audio] OpenAL exception: " + e.getClass().getSimpleName()
                        + " " + e.getMessage());
                e.printStackTrace();
            }
        });
    }

    /**
     * 播放 PCM 音频并等待完成（用于需要同步的场景）
     */
    public static void playPCMAudioSync(byte[] pcmData, int sampleRate, Runnable onComplete) {
        if (pcmData == null || pcmData.length == 0) {
            if (onComplete != null) onComplete.run();
            return;
        }
        if (IS_ANDROID) {
            playPCMviaOpenAL(pcmData, sampleRate);
            // OpenAL is async, estimate duration
            long durationMs = (long) pcmData.length * 1000L / (sampleRate * 2);
            CompletableFuture.runAsync(() -> {
                try { Thread.sleep(Math.max(500, durationMs)); } catch (Exception e) {}
                if (onComplete != null) Minecraft.getInstance().execute(onComplete);
            });
        } else {
            playPCMviaJavaSound(pcmData, sampleRate);
            if (onComplete != null) onComplete.run();
        }
    }

    // ==================== 麦克风采集（跨平台） ====================

    /**
     * @deprecated 已由 MicrophoneRecorder.androidRecordLoop 直接使用 ZalithMicBridge
     */
    public static byte[] captureMic(int durationMs, int sampleRate) {
        return null;
    }
}
