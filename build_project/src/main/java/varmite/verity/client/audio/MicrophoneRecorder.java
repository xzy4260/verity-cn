package varmite.verity.client.audio;

import java.io.ByteArrayOutputStream;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.TargetDataLine;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.api.distmarker.OnlyIn;
import varmite.verity.VerityPlatform;
import varmite.verity.ZalithMicBridge;
import varmite.verity.entity.AI.AiAPI;

@OnlyIn(value = Dist.CLIENT)
public class MicrophoneRecorder {
    private TargetDataLine targetLine;
    private volatile boolean isRecording = false;
    private ByteArrayOutputStream audioStream;
    private Thread recordingThread;
    private volatile double audioLevel = 0.0;
    private final boolean isAndroid = VerityPlatform.isAndroid();
    private ZalithMicBridge zalithMic;

    public AudioFormat getAudioFormat() {
        return new AudioFormat(16000.0f, 16, 1, true, false);
    }

    public MicrophoneRecorder() {
        MicrophoneManager.scanForMicrophones(this.getAudioFormat());
    }

    public double getAudioLevel() {
        return this.audioLevel;
    }

    public boolean isRecording() {
        return this.isRecording;
    }

    public void startRecording() {
        if (this.isRecording) return;

        // Android: 流式 OpenAL 录音（支持实时电平）
        if (isAndroid) {
            zalithMic = new ZalithMicBridge();
            if (!zalithMic.open(16000)) {
                System.out.println("[Verity Audio] Android mic open failed");
                return;
            }
            this.isRecording = true;
            this.audioLevel = 0.0;
            this.audioStream = new ByteArrayOutputStream();
            this.recordingThread = new Thread(this::androidRecordLoop, "Verity-Mic-Android");
            this.recordingThread.setDaemon(true);
            this.recordingThread.start();
            System.out.println("[Verity Audio] Android mic stream started");
            return;
        }

        // Desktop: javax.sound path
        try {
            AudioFormat format = this.getAudioFormat();
            Mixer.Info selectedMixer = MicrophoneManager.getSelectedMicrophone();

            if (selectedMixer != null) {
                try {
                    this.targetLine = AudioSystem.getTargetDataLine(format, selectedMixer);
                } catch (Exception e) {
                    System.err.println("[Verity Audio] Mic open via name failed, trying default.");
                }
            }

            if (this.targetLine == null) {
                this.targetLine = AudioSystem.getTargetDataLine(format, null);
            }

            if (this.targetLine == null) {
                System.err.println("[Verity Audio] No microphone available!");
                return;
            }

            this.targetLine.open(format);
            this.targetLine.start();
            this.isRecording = true;
            this.audioLevel = 0.0;
            this.audioStream = new ByteArrayOutputStream();
            this.recordingThread = new Thread(this::recordLoop, "Verity-Audio-Recorder");
            this.recordingThread.setDaemon(true);
            this.recordingThread.start();
            System.out.println("[Verity Audio] Recording...");
        } catch (LineUnavailableException e) {
            System.err.println("[Verity Audio] Failed to open microphone line.");
            e.printStackTrace();
        }
    }

    /** 安卓流式录音循环：持续读取 short 样本 + 实时更新电平 */
    private void androidRecordLoop() {
        byte[] buf = new byte[3200];
        double[] rmsOut = new double[1];
        while (this.isRecording) {
            int bytes = zalithMic.read(buf, rmsOut);
            if (bytes > 0) {
                synchronized (audioStream) {
                    audioStream.write(buf, 0, bytes);
                }
            }
            // 平滑电平（和桌面版一致）
            this.audioLevel = this.audioLevel * 0.5 + rmsOut[0] * 0.5;
            try { Thread.sleep(30); } catch (Exception ignored) {}
        }
    }

    // 桌面 recordLoop 不变
    private void recordLoop() {
        byte[] buffer = new byte[this.targetLine.getBufferSize() / 5];
        while (this.isRecording) {
            int bytesRead = this.targetLine.read(buffer, 0, buffer.length);
            if (bytesRead <= 0) continue;
            this.audioStream.write(buffer, 0, bytesRead);
            long sum = 0L;
            for (int i = 0; i < bytesRead - 1; i += 2) {
                short sample = (short) (buffer[i + 1] << 8 | buffer[i] & 0xFF);
                sum += (long) sample * (long) sample;
            }
            double rms = Math.sqrt((double) sum / ((double) bytesRead / 2.0));
            double targetLevel = Math.min(1.0, rms / 32767.0 * 4.0);
            this.audioLevel = this.audioLevel * 0.5 + targetLevel * 0.5;
        }
    }

    public void stopRecordingAndTranscribe(Consumer<String> onTranscriptionComplete) {
        if (!this.isRecording) {
            if (onTranscriptionComplete != null) onTranscriptionComplete.accept("");
            return;
        }
        this.isRecording = false;
        this.audioLevel = 0.0;
        if (this.targetLine != null) {
            this.targetLine.stop();
            this.targetLine.close();
        }
        if (this.zalithMic != null) {
            this.zalithMic.close();
            this.zalithMic = null;
        }
        CompletableFuture.supplyAsync(() -> {
            if (this.recordingThread != null && this.recordingThread.isAlive()) {
                try {
                    this.recordingThread.join(500L);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            byte[] audioData;
            synchronized (this.audioStream) {
                audioData = this.audioStream.toByteArray();
            }
            System.out.println("[Verity Audio] Captured " + audioData.length + " bytes.");
            return AiAPI.transcribeAudio(audioData, this.getAudioFormat());
        }).thenAccept(transcribedText -> {
            if (onTranscriptionComplete != null) {
                onTranscriptionComplete.accept((String) transcribedText);
            }
        });
    }

    public byte[] stopRecording() {
        if (!this.isRecording) return new byte[0];
        this.isRecording = false;
        this.audioLevel = 0.0;
        if (this.targetLine != null) {
            this.targetLine.stop();
            this.targetLine.close();
        }
        if (this.zalithMic != null) {
            this.zalithMic.close();
            this.zalithMic = null;
        }
        if (this.recordingThread != null && this.recordingThread.isAlive()) {
            try {
                this.recordingThread.join(500L);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return this.audioStream.toByteArray();
    }
}
