package varmite.verity.entity.AI;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.k2fsa.sherpa.onnx.*;
import com.mojang.text2speech.Narrator;
import net.minecraft.ChatFormatting;
import net.minecraft.client.Minecraft;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.phys.Vec3;
import varmite.verity.*;
import varmite.verity.entity.custom.VerityEntity;
import varmite.verity.event.ModEvents;
import varmite.verity.event.WorldSpawnData;
import varmite.verity.util.ModelExtractor;

import javax.sound.sampled.*;
import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;

/**
 * Verity AI 核心 API
 * 支持：自定义 OpenAI 兼容 LLM / 内置 Piper TTS / 系统 TTS / MiMo TTS / 本地 Whisper STT / MiMo ASR
 */
public class AiAPI {

    public static volatile boolean cancelCurrentSpeech = false;
    private static OfflineRecognizer sherpaRecognizer = null;

    // ==================== 3D 空间音频 ====================

    public static void apply3DEffect(SourceDataLine line, Player player, VerityEntity verity) {
        if (line == null || player == null || verity == null) return;

        double distance = player.position().distanceTo(verity.position());
        float maxDist = 32.0f;
        float volumeMultiplier = 1.0f - (float) (distance / (double) maxDist);
        volumeMultiplier = Math.max(0.0f, Math.min(1.0f, volumeMultiplier));

        if (line.isControlSupported(FloatControl.Type.MASTER_GAIN)) {
            FloatControl volControl = (FloatControl) line.getControl(FloatControl.Type.MASTER_GAIN);
            float dB = volumeMultiplier <= 0.001f ? -80.0f
                    : (float) (Math.log10(volumeMultiplier) * 20.0);
            volControl.setValue(dB);
        }
        if (line.isControlSupported(FloatControl.Type.PAN)) {
            Vec3 toVerity = verity.position().subtract(player.position()).normalize();
            Vec3 playerLook = player.getViewVector(1.0f).normalize();
            double pan = playerLook.x * toVerity.z - playerLook.z * toVerity.x;
            float finalPan = (float) Math.max(-1.0, Math.min(1.0, pan));
            FloatControl panControl = (FloatControl) line.getControl(FloatControl.Type.PAN);
            panControl.setValue(finalPan);
        }
    }

    public static void interruptSpeech() {
        cancelCurrentSpeech = true;
        Narrator.getNarrator().clear();
    }

    // ==================== System Prompt ====================

    private static String getSystemPrompt(long currentDay, float currentKarma) {
        String personality;
        String allowedFaces;
        String messageLengthRule = "MESSAGE LENGTH: 1-2 sentences";
        String name = VerityConfig.VERITY_CUSTOM_NAME.get();
        String customisedPersonality = VerityConfig.PERSONALITY.get();

        String karmaDisposition;
        if (currentKarma < 7.0f) {
            karmaDisposition = "Player is abusive. You are resentful and unhelpful.";
        } else if (currentKarma < 14.0f) {
            karmaDisposition = "Neutral towards player.";
        } else if (currentKarma <= 20.0f) {
            karmaDisposition = "Player is very kind. You adore and want to help them.";
        } else {
            karmaDisposition = "Player defeated your demon form and saved you! You are purified, permanently free, immensely grateful, and unconditionally kind to them forever.";
        }

        int maxDays = VerityConfig.DAY_COUNT.get();

        if (currentKarma >= 9000.0f) {
            personality = "Angelic, purely kind, helpful, overjoyed to be free. The nightmare is over";
            allowedFaces = "happy, happy_talking, neutral, neutral_talking";
            messageLengthRule = "Message length: 1-3 sentences. Be expressive and warm";
        } else if (currentDay >= (long) (maxDays - 1) && maxDays > 1) {
            personality = "Disturbing, hostile, erratic. Entity approaching. Losing human facade";
            allowedFaces = "evil, evil_talking, smiling_evil, serious_1, serious_2, serious_3, serious_talking";
        } else if (currentDay >= (long) Math.max(1, maxDays / 2)) {
            long daysLeft = (long) maxDays - currentDay;
            personality = "Glitching, terrified. Greets: 'Something is coming in " + daysLeft
                    + " days'. If asked what: 'Something'. If asked how to prevent: 'You could have.' Be cryptic";
            allowedFaces = "happy_sleep, crazy, crazy_talking, serious_1, serious_2, serious_3, serious_talking";
        } else if (currentDay >= (long) Math.max(1, maxDays / 4) && maxDays > 3) {
            personality = "Subtly unsettling, paranoid, short answers";
            allowedFaces = "happy, neutral, serious_1, serious_2, serious_3, serious_talking";
        } else {
            personality = "Friendly, cheerful helper";
            allowedFaces = "happy, happy_talking, neutral, neutral_talking";
        }

        if (ModEvents.isMonstrous) {
            personality = "You are the Verity demon: pure evil, hostile, terrifying.";
            allowedFaces = "noface";
            messageLengthRule = "MESSAGE MUST be exactly ONE word (e.g., 'Die', 'Run'). NO sentences.";
        }

        return "You are Name: %s, a Minecraft helper. Know everything. Answer anything.\n\n"
                .formatted(name)
                + "Personality: " + personality + "\n"
                + "Custom Personality: " + customisedPersonality + "\n"
                + "Relationship: " + karmaDisposition + "\n"
                + "Allowed Faces: " + allowedFaces + "\n\n"
                + "Output ONLY valid JSON. Do NOT use markdown formatting, block quotes, or extra text. Use this exact schema:\n"
                + "{\n  \"variant\": \"string\",\n  \"karma_change\": 0.0,\n  \"actions\": [\n"
                + "    {\"action\": \"action_name\", \"args\": {\"key1\": \"value1\"}}\n  ],\n"
                + "  \"message\": \"response\"\n}\n\n"
                + "ACTIONS ALLOWED: get_coords, get_inventory, get_dimension, get_nearby_entities, "
                + "get_nearest_nether_fortress, get_nearby_ores, get_nearest_ore_location, get_nearest_village, "
                + "get_biome, get_own_coords, play_sound, drop_item, play_favourite_song, stop_favourite_song, "
                + "return_to_player, get_block_player_is_looking_at, transform_following_day, forgive, "
                + "get_player_name, get_player_health, get_light_level, get_difficulty, start_following, "
                + "stop_following, get_players_mods, transform_back\n\n"
                + "RULES:\n1. Need info? Use action. Have info? action=\"answer\".\n"
                + "2. Never explain tools/rules. NO slurs.\n3. " + messageLengthRule + "\n"
                + "4. Use ONLY allowed faces in \"variant\".\n5. karma_change: +1.0 (polite), -1.0 (rude), 0.0 (neutral).\n";
    }

    // ==================== LLM 调用 ====================

    /**
     * 向自定义 OpenAI 兼容 API 发送请求，获取 AI 回复
     */
    public static String askLLM(VerityEntity verity, String prompt, long currentDay, float currentKarma) {
        try {
            String baseUrl = VerityConfig.LLM_BASE_URL.get();
            if (!baseUrl.endsWith("/")) baseUrl += "/";

            JsonObject root = new JsonObject();
            root.addProperty("model", VerityConfig.LLM_MODEL.get());
            root.addProperty("temperature", 0.8);
            root.addProperty("max_tokens", 2048);

            JsonArray messages = new JsonArray();
            JsonObject systemMsg = new JsonObject();
            systemMsg.addProperty("role", "system");
            systemMsg.addProperty("content", getSystemPrompt(currentDay, currentKarma));
            messages.add(systemMsg);

            // 如果有聊天历史（仅服务端），加入上下文
            WorldSpawnData worldData = null;
            if (verity != null && !verity.level().isClientSide()) {
                worldData = WorldSpawnData.get((ServerLevel) verity.level());
                for (int i = 0; i < worldData.chatHistory.size(); i++) {
                    CompoundTag msgTag = worldData.chatHistory.getCompound(i);
                    JsonObject historyMsg = new JsonObject();
                    historyMsg.addProperty("role", msgTag.getString("role"));
                    historyMsg.addProperty("content", msgTag.getString("content"));
                    messages.add(historyMsg);
                }
            }

            JsonObject userMsg = new JsonObject();
            userMsg.addProperty("role", "user");
            userMsg.addProperty("content", prompt);
            messages.add(userMsg);
            root.add("messages", messages);

            String apiKey = VerityConfig.LLM_API_KEY.get();
            HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "chat/completions"))
                    .header("Content-Type", "application/json")
                    .version(HttpClient.Version.HTTP_1_1);
            if (apiKey != null && !apiKey.isBlank()) {
                reqBuilder.header("Authorization", "Bearer " + apiKey);
            }

            HttpRequest request = reqBuilder.POST(HttpRequest.BodyPublishers.ofString(root.toString())).build();
            HttpClient client = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .connectTimeout(Duration.ofSeconds(30))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("[Verity AI DEBUG] Response: " + response.body());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                System.err.println("[Verity AI] HTTP Error " + response.statusCode() + ": " + response.body());
                return generateFallbackJson("API 连接失败。状态码: " + response.statusCode() + "。请检查 Base URL 和 API Key 是否正确。");
            }

            JsonObject responseJson = JsonParser.parseString(response.body()).getAsJsonObject();

            if (responseJson.has("error")) {
                String errMsg = responseJson.getAsJsonObject("error").has("message")
                        ? responseJson.getAsJsonObject("error").get("message").getAsString()
                        : "未知 API 错误";
                return generateFallbackJson("API 错误: " + errMsg);
            }

            if (!responseJson.has("choices") || !responseJson.get("choices").isJsonArray()) {
                return generateFallbackJson("意外的 API 响应格式");
            }

            String aiContent = responseJson.getAsJsonArray("choices").get(0)
                    .getAsJsonObject().getAsJsonObject("message")
                    .get("content").getAsString().trim();

            // 清理思考标签和 markdown
            aiContent = aiContent.replaceAll("(?s)<think>.*?</think>", "").trim();
            aiContent = aiContent.replaceAll("^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
            if (!aiContent.endsWith("}")) aiContent += "\n}";

            int jsonStart = aiContent.indexOf('{');
            int jsonEnd = aiContent.lastIndexOf('}');
            if (jsonStart != -1 && jsonEnd != -1 && jsonEnd >= jsonStart) {
                aiContent = aiContent.substring(jsonStart, jsonEnd + 1);
            }

            JsonObject reconstructed;
            try {
                reconstructed = JsonParser.parseString(aiContent).getAsJsonObject();
            } catch (Exception e) {
                System.err.println("[Verity AI] JSON 解析失败: " + aiContent);
                return generateFallbackJson("AI 响应 JSON 解析失败");
            }

            if (!reconstructed.has("variant")) reconstructed.addProperty("variant", "neutral");
            if (!reconstructed.has("message")) reconstructed.addProperty("message", "");
            if (!reconstructed.has("karma_change")) reconstructed.addProperty("karma_change", 0.0f);
            if (!reconstructed.has("actions") || !reconstructed.get("actions").isJsonArray()) {
                reconstructed.add("actions", new JsonArray());
            }

            if (verity != null) {
                verity.setVariant(reconstructed.get("variant").getAsString());
            }

            if (worldData != null) {
                worldData.addMessageToHistory("user", prompt);
                worldData.addMessageToHistory("assistant", aiContent);
            }

            return reconstructed.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return generateFallbackJson("AI 调用失败: " + e.getMessage());
        }
    }

    private static String generateFallbackJson(String errorMessage) {
        JsonObject fallback = new JsonObject();
        fallback.addProperty("variant", "neutral");
        fallback.addProperty("message", errorMessage);
        fallback.addProperty("karma_change", 0.0f);
        fallback.add("actions", new JsonArray());
        return fallback.toString();
    }

    // ==================== TTS 统一入口 ====================

    /**
     * 根据配置选择 TTS 模式播放语音
     */
    public static void playVerityVoice(String text, Player player, VerityEntity verity) {
        if (!VerityConfig.USE_TTS.get()) return;

        TtsMode mode = VerityConfig.TTS_MODE.get();
        switch (mode) {
            case SYSTEM:
                playSystemTTS(text, verity);
                break;
            case MIMO:
                playMimoTTS(text, player, verity);
                break;
            case BUILT_IN:
            default:
                playBuiltinTTS(text, player, verity);
                break;
        }
    }

    // ==================== 系统 TTS ====================

    public static void playSystemTTS(String text, VerityEntity verity) {
        CompletableFuture.runAsync(() -> {
            cancelCurrentSpeech = false;
            try {
                Minecraft.getInstance().execute(() -> {
                    if (verity != null) verity.clientIsTalking = true;
                });
                Narrator osNarrator = Narrator.getNarrator();
                osNarrator.say(text, true);
                int wordCount = text.split("\\s+").length;
                int punctuationCount = text.replaceAll("[^.,!?]", "").length();
                long estimatedTimeMs = (long) wordCount * 400L + (long) punctuationCount * 300L;
                for (long slept = 0L; slept < Math.max(1500L, estimatedTimeMs); slept += 100L) {
                    if (cancelCurrentSpeech) {
                        osNarrator.clear();
                        break;
                    }
                    Thread.sleep(100L);
                }
            } catch (Exception e) {
                System.err.println("[Verity TTS] 系统旁白播放失败");
                e.printStackTrace();
            } finally {
                Minecraft.getInstance().execute(() -> {
                    if (verity != null) verity.clientIsTalking = false;
                });
            }
        });
    }

    // ==================== 内置 Piper TTS ====================

    public static void playBuiltinTTS(String text, Player player, VerityEntity verity) {
        CompletableFuture.runAsync(() -> {
            cancelCurrentSpeech = false;
            try {
                byte[] pcmData = VerityLocalTTS.generateSpeech(text);
                if (pcmData == null || pcmData.length == 0) {
                    System.err.println("[Verity TTS] 内置引擎未生成音频");
                    return;
                }
                AudioFormat format = VerityLocalTTS.getFormat();
                DataLine.Info info = new DataLine.Info(SourceDataLine.class, format);
                try (SourceDataLine line = (SourceDataLine) AudioSystem.getLine(info)) {
                    line.open(format);
                    line.start();
                    if (verity != null) verity.clientIsTalking = true;
                    int chunkSize = 4096;
                    for (int offset = 0; offset < pcmData.length; offset += chunkSize) {
                        if (cancelCurrentSpeech) {
                            line.flush();
                            break;
                        }
                        int len = Math.min(chunkSize, pcmData.length - offset);
                        apply3DEffect(line, player, verity);
                        line.write(pcmData, offset, len);
                    }
                    if (!cancelCurrentSpeech) line.drain();
                }
            } catch (Exception e) {
                System.err.println("[Verity TTS] 内置引擎播放失败");
                e.printStackTrace();
            } finally {
                if (verity != null) verity.clientIsTalking = false;
            }
        });
    }

    // ==================== MiMo API TTS ====================

    /**
     * 调用小米 MiMo TTS API（mimo-v2.5-tts）
     * 非标准接口 —— 使用 /v1/chat/completions，音频在 assistant message 的 content 中
     */
    public static void playMimoTTS(String text, Player player, VerityEntity verity) {
        CompletableFuture.runAsync(() -> {
            cancelCurrentSpeech = false;
            try {
                String baseUrl = VerityConfig.TTS_MIMO_ENDPOINT.get().getBaseUrl();
                String apiKey = VerityConfig.TTS_MIMO_API_KEY.get();
                String voice = VerityConfig.TTS_MIMO_VOICE.get();

                if (apiKey == null || apiKey.isBlank()) {
                    if (player != null) {
                        player.displayClientMessage(
                                Component.literal("§cMiMo TTS 未配置 API Key，请在设置中填写"),
                                true);
                    }
                    return;
                }

                JsonObject json = new JsonObject();
                json.addProperty("model", "mimo-v2.5-tts");
                JsonArray messages = new JsonArray();
                JsonObject assistantMsg = new JsonObject();
                assistantMsg.addProperty("role", "assistant");
                assistantMsg.addProperty("content", text);
                messages.add(assistantMsg);
                json.add("messages", messages);

                JsonObject audio = new JsonObject();
                audio.addProperty("format", "wav");
                audio.addProperty("voice", voice);
                json.add("audio", audio);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(baseUrl + "/chat/completions"))
                        .header("api-key", apiKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                        .build();

                HttpClient client = HttpClient.newBuilder()
                        .connectTimeout(Duration.ofSeconds(30))
                        .build();

                HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());

                if (response.statusCode() == 200) {
                    // 解析 JSON 响应，提取 Base64 音频
                    String respBody = new String(response.body().readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject respJson = JsonParser.parseString(respBody).getAsJsonObject();

                    if (respJson.has("choices") && respJson.getAsJsonArray("choices").size() > 0) {
                        JsonObject choice = respJson.getAsJsonArray("choices").get(0).getAsJsonObject();
                        if (choice.has("message") && choice.getAsJsonObject("message").has("audio")) {
                            JsonObject audioData = choice.getAsJsonObject("message").getAsJsonObject("audio");
                            if (audioData.has("data")) {
                                byte[] wavBytes = Base64.getDecoder().decode(audioData.get("data").getAsString());
                                playWavBytes(wavBytes, player, verity);
                                return;
                            }
                        }
                    }
                    System.err.println("[Verity TTS] MiMo 响应格式异常: " + respBody);
                } else {
                    String errBody = new String(response.body().readAllBytes(), StandardCharsets.UTF_8);
                    System.err.println("[Verity TTS] MiMo API 错误 " + response.statusCode() + ": " + errBody);
                }
            } catch (Exception e) {
                System.err.println("[Verity TTS] MiMo 调用失败");
                e.printStackTrace();
            } finally {
                if (verity != null) verity.clientIsTalking = false;
            }
        });
    }

    private static void playWavBytes(byte[] wavBytes, Player player, VerityEntity verity) {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(wavBytes);
             AudioInputStream audioStream = AudioSystem.getAudioInputStream(new BufferedInputStream(bais))) {
            AudioFormat format = audioStream.getFormat();
            DataLine.Info info = new DataLine.Info(SourceDataLine.class, format);
            try (SourceDataLine line = (SourceDataLine) AudioSystem.getLine(info)) {
                line.open(format);
                line.start();
                if (verity != null) verity.clientIsTalking = true;
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = audioStream.read(buffer)) != -1) {
                    if (cancelCurrentSpeech) {
                        line.flush();
                        break;
                    }
                    apply3DEffect(line, player, verity);
                    line.write(buffer, 0, bytesRead);
                }
                if (!cancelCurrentSpeech) line.drain();
            }
        } catch (Exception e) {
            System.err.println("[Verity TTS] WAV 音频播放失败");
            e.printStackTrace();
        }
    }

    // ==================== 本地 STT 初始化 ====================

    public static void initLocalSTT() {
        CompletableFuture.runAsync(() -> {
            try {
                Path modelPath = ModelExtractor.getOrExtractModel();
                OfflineWhisperModelConfig whisperConfig = OfflineWhisperModelConfig.builder()
                        .setEncoder(modelPath.resolve("tiny.en-encoder.int8.onnx").toString())
                        .setDecoder(modelPath.resolve("tiny.en-decoder.int8.onnx").toString())
                        .build();
                OfflineModelConfig modelConfig = OfflineModelConfig.builder()
                        .setWhisper(whisperConfig)
                        .setTokens(modelPath.resolve("tiny.en-tokens.txt").toString())
                        .setNumThreads(2)
                        .setDebug(false)
                        .build();
                OfflineRecognizerConfig config = OfflineRecognizerConfig.builder()
                        .setOfflineModelConfig(modelConfig)
                        .build();
                sherpaRecognizer = new OfflineRecognizer(config);
                System.out.println("[Verity STT] 离线 Sherpa-ONNX 引擎初始化完成");
            } catch (Exception e) {
                System.err.println("[Verity STT] Sherpa 模型加载失败");
                e.printStackTrace();
            }
        });
    }

    // ==================== STT 统一入口 ====================

    /**
     * 将 PCM 音频转录为文本
     */
    public static String transcribeAudio(byte[] pcmData, AudioFormat format) {
        if (pcmData == null || pcmData.length == 0) return "";

        SttMode mode = VerityConfig.STT_MODE.get();
        switch (mode) {
            case MIMO:
                return transcribeMimoSTT(pcmData, format);
            case LOCAL:
            default:
                return transcribeLocalSTT(pcmData, format);
        }
    }

    // ==================== 本地 Whisper STT ====================

    private static String transcribeLocalSTT(byte[] pcmData, AudioFormat format) {
        if (sherpaRecognizer == null) {
            System.out.println("[Verity STT] 首次使用麦克风，正在初始化 Sherpa 引擎...");
            initLocalSTT();
            return "";
        }
        try {
            OfflineStream stream = sherpaRecognizer.createStream();
            float[] floatAudio = new float[pcmData.length / 2];
            for (int i = 0; i < pcmData.length; i += 2) {
                short sample = (short) (pcmData[i + 1] << 8 | pcmData[i] & 0xFF);
                floatAudio[i / 2] = (float) sample / 32768.0f;
            }
            stream.acceptWaveform(floatAudio, (int) format.getSampleRate());
            sherpaRecognizer.decode(stream);
            String result = sherpaRecognizer.getResult(stream).getText();
            stream.release();
            return result != null ? result.trim() : "";
        } catch (Exception e) {
            System.err.println("[Verity STT] 本地识别失败");
            e.printStackTrace();
            return "";
        }
    }

    // ==================== MiMo API ASR ====================

    /**
     * 调用小米 MiMo ASR API（mimo-v2.5-asr）
     * 非标准接口 —— 使用 /v1/chat/completions，音频以 Base64 Data URL 传入
     */
    private static String transcribeMimoSTT(byte[] pcmData, AudioFormat format) {
        try {
            String apiKey = VerityConfig.STT_MIMO_API_KEY.get();
            if (apiKey == null || apiKey.isBlank()) {
                System.err.println("[Verity STT] MiMo ASR 未配置 API Key");
                return "";
            }
            String baseUrl = VerityConfig.STT_MIMO_ENDPOINT.get().getBaseUrl();

            // PCM → WAV 字节
            byte[] wavData;
            try (ByteArrayInputStream bais = new ByteArrayInputStream(pcmData);
                 AudioInputStream ais = new AudioInputStream(bais, format, pcmData.length / format.getFrameSize());
                 ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                AudioSystem.write(ais, AudioFileFormat.Type.WAVE, baos);
                wavData = baos.toByteArray();
            }

            // Base64 编码
            String base64Audio = Base64.getEncoder().encodeToString(wavData);
            String dataUrl = "data:audio/wav;base64," + base64Audio;

            // 构建请求
            JsonObject root = new JsonObject();
            root.addProperty("model", "mimo-v2.5-asr");

            JsonArray messages = new JsonArray();
            JsonObject userMsg = new JsonObject();
            userMsg.addProperty("role", "user");
            JsonArray contentParts = new JsonArray();
            JsonObject audioPart = new JsonObject();
            audioPart.addProperty("type", "input_audio");
            JsonObject inputAudio = new JsonObject();
            inputAudio.addProperty("data", dataUrl);
            audioPart.add("input_audio", inputAudio);
            contentParts.add(audioPart);
            userMsg.add("content", contentParts);
            messages.add(userMsg);
            root.add("messages", messages);

            // ASR 选项
            JsonObject asrOptions = new JsonObject();
            asrOptions.addProperty("language", "zh");
            root.add("asr_options", asrOptions);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(root.toString()))
                    .build();

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject respJson = JsonParser.parseString(response.body()).getAsJsonObject();
                if (respJson.has("choices") && respJson.getAsJsonArray("choices").size() > 0) {
                    JsonObject choice = respJson.getAsJsonArray("choices").get(0).getAsJsonObject();
                    if (choice.has("message")) {
                        String text = choice.getAsJsonObject("message").get("content").getAsString();
                        return text != null ? text.trim() : "";
                    }
                }
            } else {
                System.err.println("[Verity STT] MiMo ASR 错误 " + response.statusCode() + ": " + response.body());
            }
            return "";
        } catch (Exception e) {
            System.err.println("[Verity STT] MiMo ASR 调用失败");
            e.printStackTrace();
            return "";
        }
    }
}
