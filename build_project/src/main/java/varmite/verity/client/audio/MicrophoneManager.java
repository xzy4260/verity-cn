package varmite.verity.client.audio;

import java.util.ArrayList;
import java.util.List;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.TargetDataLine;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.Component;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.api.distmarker.OnlyIn;

@OnlyIn(value = Dist.CLIENT)
public class MicrophoneManager {
    private static final List<Mixer.Info> AVAILABLE_MICS = new ArrayList<>();
    private static int currentIndex = -1;

    public static void scanForMicrophones(AudioFormat format) {
        AVAILABLE_MICS.clear();
        for (Mixer.Info info : AudioSystem.getMixerInfo()) {
            try {
                TargetDataLine testLine = AudioSystem.getTargetDataLine(format, info);
                testLine.close();
                AVAILABLE_MICS.add(info);
            } catch (Exception e) {
                System.err.println("[Verity Audio] Skipping mic: " + info.getName());
            }
        }
        if (!AVAILABLE_MICS.isEmpty() && currentIndex == -1) {
            currentIndex = 0;
        }
    }

    public static Mixer.Info getSelectedMicrophone() {
        if (AVAILABLE_MICS.isEmpty() || currentIndex < 0 || currentIndex >= AVAILABLE_MICS.size()) {
            return null;
        }
        return AVAILABLE_MICS.get(currentIndex);
    }

    public static void cycleMicrophone() {
        if (AVAILABLE_MICS.isEmpty()) {
            sendClientMessage("No compatible microphones found.");
            return;
        }
        currentIndex = (currentIndex + 1) % AVAILABLE_MICS.size();
        Mixer.Info selected = AVAILABLE_MICS.get(currentIndex);
        sendClientMessage("Microphone: " + selected.getName());
    }

    private static void sendClientMessage(String text) {
        if (Minecraft.getInstance().player != null) {
            Minecraft.getInstance().player.displayClientMessage(Component.literal(text), false);
        }
    }
}
