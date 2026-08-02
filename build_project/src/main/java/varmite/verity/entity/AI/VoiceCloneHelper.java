package varmite.verity.entity.AI;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;

import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import varmite.verity.CloneVoice;
import varmite.verity.entity.custom.VerityEntity;

/**
 * 音色克隆辅助类
 *
 * 修复 TTS 克隆问题：
 * 1. 只使用用户配置的 TTS_CLONE_ENDPOINT 和 TTS_CLONE_API_KEY（不走代理/官网）
 * 2. API Key 为空时回退到 playMimoTTS（不再静默返回）
 * 3. 任何异常都回退到 playMimoTTS，保证 TTS 不中断
 *
 * 使用反射读取 VerityConfig，避免编译时依赖
 */
public class VoiceCloneHelper {

    /**
     * 播放音色克隆 TTS
     * 入口方法，由 AiAPI.playVerityVoice 在 TTS_MODE == VOICE_CLONE 时调用
     */
    public static void play(String text, Player player, VerityEntity verity) {
        CompletableFuture.runAsync(() -> {
            AiAPI.cancelCurrentSpeech = false;
            try {
                // 直接使用用户配置的克隆端点和 API Key（不走代理/官网）
                Object endpoint = getConfigEnum("TTS_CLONE_ENDPOINT");
                String baseUrl = invokeGetBaseUrl(endpoint);
                String apiKey = getConfigString("TTS_CLONE_API_KEY");
                System.out.println("[Verity TTS] Voice Clone | baseUrl=" + baseUrl + " | hasApiKey=" + (apiKey != null && !apiKey.isBlank()));

                // API Key 为空 → 回退到 playMimoTTS
                if (apiKey == null || apiKey.isBlank()) {
                    System.out.println("[Verity TTS] Voice Clone API Key is blank, falling back to MiMo TTS");
                    AiAPI.playMimoTTS(text, player, verity);
                    return;
                }

                // 加载参考音频：优先自定义音频，其次 jar 内置预设
                byte[] refAudio = loadReferenceAudioWithFallback();
                if (refAudio == null || refAudio.length == 0) {
                    System.out.println("[Verity TTS] Voice Clone reference audio unavailable, falling back to MiMo TTS");
                    if (player != null) {
                        player.sendSystemMessage((Component) Component.literal((String) "\u00a7e\u97f3\u8272\u514b\u9686\u53c2\u8003\u97f3\u9891\u4e0d\u53ef\u7528\uff0c\u5df2\u5207\u6362\u4e3a\u9ed8\u8ba4 TTS"));
                    }
                    AiAPI.playMimoTTS(text, player, verity);
                    return;
                }

                // 参考音频过大（>10MB base64）→ 回退
                String refBase64 = Base64.getEncoder().encodeToString(refAudio);
                if (refBase64.length() > 0xA00000) {
                    System.out.println("[Verity TTS] Voice Clone reference audio too large (" + refAudio.length + " bytes), falling back to MiMo TTS");
                    AiAPI.playMimoTTS(text, player, verity);
                    return;
                }

                // 构建请求
                String voiceDataUri = "data:audio/mpeg;base64," + refBase64;
                String wrappedText = SpeedHelper.wrapCloneText(text);

                JsonObject json = new JsonObject();
                json.addProperty("model", "mimo-v2.5-tts-voiceclone");
                JsonArray messages = new JsonArray();
                JsonObject userMsg = new JsonObject();
                userMsg.addProperty("role", "user");
                userMsg.addProperty("content", "");
                messages.add((JsonElement) userMsg);
                JsonObject assistantMsg = new JsonObject();
                assistantMsg.addProperty("role", "assistant");
                assistantMsg.addProperty("content", wrappedText);
                messages.add((JsonElement) assistantMsg);
                json.add("messages", (JsonElement) messages);
                JsonObject audio = new JsonObject();
                audio.addProperty("format", "wav");
                audio.addProperty("voice", voiceDataUri);
                json.add("audio", (JsonElement) audio);

                System.out.println("[Verity TTS] Voice Clone sending | refAudio=" + refAudio.length + " bytes");

                // 构建 HTTP 请求（直连用户配置的端点）
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(baseUrl + "/chat/completions"))
                        .header("Content-Type", "application/json")
                        .header("api-key", apiKey)
                        .timeout(Duration.ofSeconds(60L))
                        .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                        .build();

                HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30L)).build();

                HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());

                if (response.statusCode() == 200) {
                    String respBody = new String(response.body().readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject respJson = JsonParser.parseString((String) respBody).getAsJsonObject();

                    if (respJson.has("choices") && respJson.getAsJsonArray("choices").size() > 0) {
                        JsonObject choice = respJson.getAsJsonArray("choices").get(0).getAsJsonObject();
                        if (choice.has("message") && choice.getAsJsonObject("message").has("audio")) {
                            JsonObject audioData = choice.getAsJsonObject("message").getAsJsonObject("audio");
                            if (audioData.has("data")) {
                                byte[] wavBytes = Base64.getDecoder().decode(audioData.get("data").getAsString());
                                System.out.println("[Verity TTS] Voice Clone success | wavBytes=" + wavBytes.length);
                                invokePlayWavBytes(wavBytes, player, verity);
                                return;
                            }
                        }
                    }
                    System.out.println("[Verity TTS] Voice Clone unexpected response: " + respBody);
                    // 响应格式异常 → 回退
                    AiAPI.playMimoTTS(text, player, verity);
                } else {
                    String errBody = new String(response.body().readAllBytes(), StandardCharsets.UTF_8);
                    System.out.println("[Verity TTS] Voice Clone API error " + response.statusCode() + ": " + errBody);
                    // API 错误 → 回退
                    AiAPI.playMimoTTS(text, player, verity);
                }
            } catch (Exception e) {
                System.out.println("[Verity TTS] Voice Clone failed, falling back to MiMo TTS: " + e.getMessage());
                e.printStackTrace();
                // 任何异常 → 回退到 MiMo TTS
                try {
                    AiAPI.playMimoTTS(text, player, verity);
                } catch (Exception ex) {
                    // 连回退都失败，忽略
                }
            } finally {
                if (verity != null) {
                    verity.clientIsTalking = false;
                }
            }
        });
    }

    /**
     * 加载参考音频：优先自定义音频（受 USE_CUSTOM_CLONE_AUDIO 开关控制），其次 jar 内置预设
     */
    private static byte[] loadReferenceAudioWithFallback() {
        // 1. 尝试加载自定义音频（受开关控制，默认开启）
        boolean useCustom = getConfigBoolean("USE_CUSTOM_CLONE_AUDIO");
        if (useCustom) {
            try {
                byte[] custom = SpeedHelper.tryLoadCustomAudio();
                if (custom != null && custom.length > 0) {
                    System.out.println("[Verity TTS] Voice Clone using custom audio | " + custom.length + " bytes");
                    return custom;
                }
            } catch (Exception e) {
                System.out.println("[Verity TTS] Custom audio load failed: " + e.getMessage());
            }
        } else {
            System.out.println("[Verity TTS] Voice Clone custom audio disabled by switch, using preset");
        }

        // 2. 加载 jar 内置预设音频
        try {
            CloneVoice cloneVoice = (CloneVoice) getConfigEnum("TTS_CLONE_VOICE");
            String refPath = "/assets/verity/tts/reference/" + cloneVoice.getFileName();
            InputStream is = VoiceCloneHelper.class.getResourceAsStream(refPath);
            if (is != null) {
                byte[] data = is.readAllBytes();
                is.close();
                if (data != null && data.length > 0) {
                    System.out.println("[Verity TTS] Voice Clone loaded preset | " + refPath + " | " + data.length + " bytes");
                    return data;
                }
            }
            System.out.println("[Verity TTS] Voice Clone preset not found: " + refPath);
        } catch (Exception e) {
            System.out.println("[Verity TTS] Voice Clone preset load failed: " + e.getMessage());
        }

        return null;
    }

    // === 反射读取配置 ===

    private static boolean getConfigBoolean(String fieldName) {
        try {
            Class<?> cfgClass = Class.forName("varmite.verity.VerityConfig");
            Field field = cfgClass.getField(fieldName);
            Object configValue = field.get(null);
            Object value = configValue.getClass().getMethod("get").invoke(configValue);
            return ((Boolean) value).booleanValue();
        } catch (Exception e) {
            return false;
        }
    }

    private static String getConfigString(String fieldName) {
        try {
            Class<?> cfgClass = Class.forName("varmite.verity.VerityConfig");
            Field field = cfgClass.getField(fieldName);
            Object configValue = field.get(null);
            Object value = configValue.getClass().getMethod("get").invoke(configValue);
            return (String) value;
        } catch (Exception e) {
            return "";
        }
    }

    private static Object getConfigEnum(String fieldName) {
        try {
            Class<?> cfgClass = Class.forName("varmite.verity.VerityConfig");
            Field field = cfgClass.getField(fieldName);
            Object configValue = field.get(null);
            return configValue.getClass().getMethod("get").invoke(configValue);
        } catch (Exception e) {
            return null;
        }
    }

    private static String invokeGetBaseUrl(Object endpoint) {
        try {
            java.lang.reflect.Method m = endpoint.getClass().getMethod("getBaseUrl");
            return (String) m.invoke(endpoint);
        } catch (Exception e) {
            return "https://api.xiaomimimo.com/v1";
        }
    }

    /**
     * 通过反射调用 AiAPI.playWavBytes（private static 方法）
     */
    private static void invokePlayWavBytes(byte[] wavBytes, Player player, VerityEntity verity) {
        try {
            Class<?> aiApiClass = Class.forName("varmite.verity.entity.AI.AiAPI");
            Method m = aiApiClass.getDeclaredMethod("playWavBytes", byte[].class, Player.class, VerityEntity.class);
            m.setAccessible(true);
            m.invoke(null, wavBytes, player, verity);
        } catch (Exception e) {
            System.out.println("[Verity TTS] Voice Clone playWavBytes reflection failed: " + e.getMessage());
        }
    }
}
