package varmite.verity;

import org.lwjgl.openal.ALC;
import org.lwjgl.openal.ALCCapabilities;

import java.lang.reflect.Method;

/**
 * ZalithLauncher 麦克风桥接 — 流式录音 + 电平读取
 */
public class ZalithMicBridge {

    private static boolean available;
    private static Method m_invokePJ, m_invokePV, m_invokePPV, m_invokePI;

    public static boolean isAvailable() { return available; }

    static { init(); }

    private static void init() {
        try {
            ALCCapabilities caps = ALC.getCapabilities();
            boolean hasFuncs = caps != null
                    && caps.alcCaptureOpenDevice != 0
                    && caps.alcCaptureCloseDevice != 0
                    && caps.alcCaptureStart != 0
                    && caps.alcCaptureStop != 0
                    && caps.alcCaptureSamples != 0;
            if (!hasFuncs) { System.out.println("[ZalithMic] ALC funcs missing"); return; }

            Class<?> jni = Class.forName("org.lwjgl.system.JNI");
            for (Method m : jni.getDeclaredMethods()) {
                String n = m.getName(); Class<?>[] p = m.getParameterTypes(); Class<?> r = m.getReturnType();
                if (n.equals("invokePJ") && p.length==4 && r==long.class) m_invokePJ=m;
                else if (n.equals("invokePV") && p.length==2 && r==void.class && p[0]==long.class) m_invokePV=m;
                else if (n.equals("invokePPV") && p.length==4 && r==void.class && p[1]==short[].class) m_invokePPV=m;
                else if (n.equals("invokePI") && p.length==2 && r==int.class && p[0]==long.class) m_invokePI=m;
            }
            if (m_invokePJ==null||m_invokePV==null||m_invokePPV==null||m_invokePI==null) {
                System.out.println("[ZalithMic] JNI methods missing"); return;
            }
            available = true;
            System.out.println("[ZalithMic] LWJGL ALC capture bridge ready");
        } catch (Throwable t) {
            System.out.println("[ZalithMic] Init failed: "+t.getClass().getSimpleName());
        }
    }

    // ============ 流式录音 API ============

    private long device;
    private short[] readBuf;

    /** 打开采集设备并开始录音，返回 true 成功 */
    public boolean open(int sampleRate) {
        if (!available) return false;
        try {
            device = (long) m_invokePJ.invoke(null, 0L, sampleRate, 0x1101, 
                ALC.getCapabilities().alcCaptureOpenDevice);
            if (device == 0) return false;
            m_invokePV.invoke(null, device, ALC.getCapabilities().alcCaptureStart);
            readBuf = new short[sampleRate / 20]; // 50ms buffer
            return true;
        } catch (Throwable t) { return false; }
    }

    /** 读取一段音频，返回读取到的字节数（0 表示无新数据），同时通过 rms 输出音量 0.0-1.0 */
    public int read(byte[] outBuf, double[] rmsOut) {
        if (device == 0) { rmsOut[0] = 0; return 0; }
        try {
            m_invokePPV.invoke(null, device, readBuf, readBuf.length, ALC.getCapabilities().alcCaptureSamples);
            // 计算 RMS 音量
            long sum = 0;
            for (short s : readBuf) { long v = s; sum += v * v; }
            double rms = Math.sqrt((double) sum / readBuf.length);
            rmsOut[0] = Math.min(1.0, rms / 16384.0);
            // 转换 short[] → byte[]
            int bytes = Math.min(readBuf.length * 2, outBuf.length);
            for (int i = 0; i < bytes/2; i++) {
                outBuf[i*2]   = (byte)(readBuf[i] & 0xFF);
                outBuf[i*2+1] = (byte)((readBuf[i] >> 8) & 0xFF);
            }
            return bytes;
        } catch (Throwable t) { rmsOut[0] = 0; return 0; }
    }

    /** 停止录音并关闭设备 */
    public void close() {
        if (device == 0) return;
        try {
            m_invokePV.invoke(null, device, ALC.getCapabilities().alcCaptureStop);
            m_invokePI.invoke(null, device, ALC.getCapabilities().alcCaptureCloseDevice);
        } catch (Throwable ignored) {}
        device = 0;
    }
}
