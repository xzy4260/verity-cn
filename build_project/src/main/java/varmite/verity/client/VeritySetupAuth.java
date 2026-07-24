package varmite.verity.client;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.minecraftforge.common.ForgeConfigSpec;
import varmite.verity.VerityAccountBridge;
import varmite.verity.VerityConfig;

import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.UUID;
import java.util.function.Consumer;

/**
 * 初始化向导的网络辅助类：OAuth 授权轮询、账户信息拉取、模型连通性检测。
 * 所有回调在后台线程触发，调用方需自行切回主线程更新 UI。
 */
public class VeritySetupAuth {

    private static volatile Thread oauthThread;
    private static volatile boolean oauthCancelled;

    /** 启动 OAuth 授权流程：打开浏览器 + 轮询 licenseKey，2 分钟超时 */
    public static synchronized void startOAuth(Consumer<String> onSuccess, Consumer<String> onFailure) {
        cancelOAuth();
        oauthCancelled = false;
        final String token = UUID.randomUUID().toString().replace("-", "");
        String loginUrl = "https://bridge.veritycn.site/auth?token=" + token;
        openBrowser(loginUrl);
        try {
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(loginUrl), null);
        } catch (Exception ignored) {}

        oauthThread = new Thread(() -> {
            long start = System.currentTimeMillis();
            long timeout = 120000L;
            while (System.currentTimeMillis() - start < timeout && !oauthCancelled) {
                try {
                    Thread.sleep(3000L);
                    if (oauthCancelled) break;
                    String url = "https://bridge.veritycn.site/api/auth?token=" + token;
                    HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET()
                            .timeout(Duration.ofSeconds(10L)).build();
                    HttpResponse<String> resp = VerityAccountBridge.TRUST_ALL_HTTP.send(req, HttpResponse.BodyHandlers.ofString());
                    if (resp.statusCode() == 200 && resp.body() != null) {
                        try {
                            JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();
                            // 判断授权是否完成，兼容两种返回格式：
                            //   {"status":"complete","licenseKey":"xxx"}  (实际格式)
                            //   {"complete":true,"licenseKey":"xxx"}     (兜底兼容)
                            boolean complete = false;
                            if (json.has("status") && !json.get("status").isJsonNull()) {
                                complete = "complete".equals(json.get("status").getAsString());
                            }
                            if (!complete && json.has("complete") && !json.get("complete").isJsonNull()) {
                                complete = json.get("complete").getAsBoolean();
                            }
                            System.out.println("[VeritySetup] oauth poll resp: " + resp.body()
                                    + " → complete=" + complete);
                            if (complete && json.has("licenseKey") && !json.get("licenseKey").isJsonNull()) {
                                String licenseKey = json.get("licenseKey").getAsString();
                                if (licenseKey != null && licenseKey.length() >= 10) {
                                    System.out.println("[VeritySetup] OAuth success, licenseKey length=" + licenseKey.length());
                                    VerityConfig.VERITY_BRIDGE_KEY.set(licenseKey);
                                    // 立即验证 set 是否生效
                                    String verify = (String) VerityConfig.VERITY_BRIDGE_KEY.get();
                                    System.out.println("[VeritySetup] verify VERITY_BRIDGE_KEY after set: "
                                            + (verify != null ? verify.length() : "null"));
                                    if (onSuccess != null) onSuccess.accept(licenseKey);
                                    return;
                                } else {
                                    System.out.println("[VeritySetup] licenseKey too short or null");
                                }
                            }
                        } catch (Exception parseEx) {
                            System.out.println("[VeritySetup] oauth parse: " + parseEx.getMessage());
                        }
                    }
                } catch (Exception e) {
                    System.out.println("[VeritySetup] oauth poll: " + e.getMessage());
                }
            }
            if (!oauthCancelled && onFailure != null) {
                System.out.println("[VeritySetup] OAuth timeout (2min)");
                onFailure.accept("timeout");
            }
        }, "VeritySetup-OAuth");
        oauthThread.setDaemon(true);
        oauthThread.start();
    }

    /** 取消正在进行的 OAuth 轮询 */
    public static synchronized void cancelOAuth() {
        oauthCancelled = true;
        if (oauthThread != null) {
            oauthThread.interrupt();
            oauthThread = null;
        }
    }

    /** 拉取账户信息 + 服务端模型配置，完成后回调 */
    public static void fetchInfo(String licenseKey, Runnable onComplete) {
        new Thread(() -> {
            try {
                String url = "https://bridge.veritycn.site/api/user/info?licenseKey=" + URLEncoder.encode(licenseKey, "UTF-8");
                HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET()
                        .timeout(Duration.ofSeconds(15L)).build();
                String body = VerityAccountBridge.TRUST_ALL_HTTP.send(req, HttpResponse.BodyHandlers.ofString()).body();
                JsonObject resp = JsonParser.parseString(body).getAsJsonObject();
                if (resp.has("success") && resp.get("success").getAsBoolean()) {
                    JsonObject data = resp.getAsJsonObject("data");
                    if (data.has("userId"))
                        VerityConfig.VERITY_USER_ID.set(String.valueOf(data.get("userId").getAsInt()));
                    if (data.has("username"))
                        VerityConfig.VERITY_USERNAME.set(data.get("username").getAsString());
                    if (data.has("email"))
                        VerityConfig.VERITY_EMAIL.set(data.get("email").getAsString());
                    if (data.has("balance"))
                        VerityConfig.VERITY_CREDITS.set(String.valueOf(data.get("balance").getAsDouble()));
                    if (data.has("deepseekBalance") && !data.get("deepseekBalance").isJsonNull()) {
                        try {
                            JsonObject ds = data.getAsJsonObject("deepseekBalance");
                            if (ds.has("is_available") && ds.get("is_available").getAsBoolean() && ds.has("balance_infos")) {
                                JsonArray infos = ds.getAsJsonArray("balance_infos");
                                if (infos.size() > 0) {
                                    JsonObject info = infos.get(0).getAsJsonObject();
                                    String currency = info.has("currency") ? info.get("currency").getAsString() : "";
                                    String total = info.has("total_balance") ? info.get("total_balance").getAsString() : "0";
                                    String symbol = currency.equals("CNY") ? "¥" : currency + " ";
                                    VerityConfig.VERITY_DS_BALANCE.set(symbol + total);
                                } else {
                                    VerityConfig.VERITY_DS_BALANCE.set("¥0");
                                }
                            } else {
                                VerityConfig.VERITY_DS_BALANCE.set("未绑定");
                            }
                        } catch (Exception e) {
                            VerityConfig.VERITY_DS_BALANCE.set("未绑定");
                        }
                    } else {
                        VerityConfig.VERITY_DS_BALANCE.set("未绑定");
                    }
                }
                // 模型配置
                try {
                    String mu = "https://bridge.veritycn.site/api/user/models?licenseKey=" + URLEncoder.encode(licenseKey, "UTF-8");
                    HttpRequest mr = HttpRequest.newBuilder().uri(URI.create(mu)).GET()
                            .timeout(Duration.ofSeconds(10L)).build();
                    String mb = VerityAccountBridge.TRUST_ALL_HTTP.send(mr, HttpResponse.BodyHandlers.ofString()).body();
                    JsonObject mrj = JsonParser.parseString(mb).getAsJsonObject();
                    if (mrj.has("success") && mrj.get("success").getAsBoolean()) {
                        JsonObject m = mrj.getAsJsonObject("data");
                        setIfHas(m, "llm", VerityConfig.VERITY_SRV_LLM);
                        setIfHas(m, "tts", VerityConfig.VERITY_SRV_TTS);
                        setIfHas(m, "ttsVoice", VerityConfig.VERITY_SRV_TTS_VOICE);
                        setIfHas(m, "stt", VerityConfig.VERITY_SRV_STT);
                    }
                } catch (Exception e) {
                    System.out.println("[VeritySetup] models: " + e.getMessage());
                }
            } catch (Exception e) {
                System.out.println("[VeritySetup] fetch: " + e.getMessage());
            }
            if (onComplete != null) onComplete.run();
        }, "VeritySetup-Fetch").start();
    }

    private static void setIfHas(JsonObject obj, String key, ForgeConfigSpec.ConfigValue<String> target) {
        if (obj.has(key) && !obj.get(key).isJsonNull()) {
            target.set(obj.get(key).getAsString());
        } else {
            target.set("—");
        }
    }

    /** 检测 LLM/TTS/STT 三个模型连通性，结果写入 VERITY_CONN_* 配置，完成后回调。
     *  优先使用传入的 licenseKey，避免配置写入时序导致读到空值。 */
    public static void testModels(String licenseKey, Runnable onComplete) {
        new Thread(() -> {
            String key = licenseKey;
            if (key == null || key.isEmpty()) {
                // 回退到配置读取
                key = (String) VerityConfig.VERITY_BRIDGE_KEY.get();
            }
            System.out.println("[VeritySetup] testModels key length: "
                    + (key != null ? key.length() : "null"));
            if (key == null || key.isEmpty()) {
                VerityConfig.VERITY_CONN_LLM.set("未登录");
                VerityConfig.VERITY_CONN_TTS.set("未登录");
                VerityConfig.VERITY_CONN_STT.set("未登录");
                if (onComplete != null) onComplete.run();
                return;
            }
            String llmModel = (String) VerityConfig.VERITY_SRV_LLM.get();
            if (llmModel == null || llmModel.isEmpty() || llmModel.equals("—")) {
                VerityConfig.VERITY_CONN_LLM.set("未配置");
            } else {
                VerityConfig.VERITY_CONN_LLM.set(testLLM(key, llmModel));
            }
            String ttsModel = (String) VerityConfig.VERITY_SRV_TTS.get();
            String ttsVoice = (String) VerityConfig.VERITY_SRV_TTS_VOICE.get();
            if (ttsModel == null || ttsModel.isEmpty() || ttsModel.equals("—")) {
                VerityConfig.VERITY_CONN_TTS.set("未配置");
            } else {
                VerityConfig.VERITY_CONN_TTS.set(testTTS(key, ttsModel, ttsVoice));
            }
            String sttModel = (String) VerityConfig.VERITY_SRV_STT.get();
            if (sttModel == null || sttModel.isEmpty() || sttModel.equals("—")) {
                VerityConfig.VERITY_CONN_STT.set("未配置");
            } else {
                VerityConfig.VERITY_CONN_STT.set(testSTT(key, sttModel));
            }
            if (onComplete != null) onComplete.run();
        }, "VeritySetup-Test").start();
    }

    private static String testLLM(String licenseKey, String model) {
        try {
            JsonObject body = new JsonObject();
            body.addProperty("model", model);
            body.addProperty("max_tokens", 1);
            JsonArray messages = new JsonArray();
            JsonObject msg = new JsonObject();
            msg.addProperty("role", "user");
            msg.addProperty("content", "hi");
            messages.add(msg);
            body.add("messages", messages);
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://bridge.veritycn.site/api/" + licenseKey + "/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .timeout(Duration.ofSeconds(15L)).build();
            HttpResponse<String> resp = VerityAccountBridge.TRUST_ALL_HTTP.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() == 200) return "通过";
            return "错误 " + resp.statusCode();
        } catch (Exception e) {
            return "连接失败";
        }
    }

    private static String testTTS(String licenseKey, String model, String voice) {
        if (voice == null || voice.isEmpty()) voice = "default";
        try {
            JsonObject body = new JsonObject();
            body.addProperty("model", model);
            body.addProperty("input", "hi");
            body.addProperty("voice", voice);
            body.addProperty("response_format", "wav");
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://bridge.veritycn.site/api/" + licenseKey + "/v1/audio/speech"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .timeout(Duration.ofSeconds(15L)).build();
            HttpResponse<byte[]> resp = VerityAccountBridge.TRUST_ALL_HTTP.send(req, HttpResponse.BodyHandlers.ofByteArray());
            if (resp.statusCode() == 200) return "通过";
            return "错误 " + resp.statusCode();
        } catch (Exception e) {
            return "连接失败";
        }
    }

    private static String testSTT(String licenseKey, String model) {
        try {
            byte[] wav = createSilenceWav(16000, 500);
            String boundary = "VWBTest" + System.currentTimeMillis();
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            String fieldHdr = "--" + boundary + "\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\n" + model + "\r\n";
            bos.write(fieldHdr.getBytes("UTF-8"));
            String fileHdr = "--" + boundary + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"test.wav\"\r\nContent-Type: audio/wav\r\n\r\n";
            bos.write(fileHdr.getBytes("UTF-8"));
            bos.write(wav);
            String end = "\r\n--" + boundary + "--\r\n";
            bos.write(end.getBytes("UTF-8"));
            byte[] body = bos.toByteArray();
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://bridge.veritycn.site/api/" + licenseKey + "/v1/audio/transcriptions"))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .timeout(Duration.ofSeconds(15L)).build();
            HttpResponse<String> resp = VerityAccountBridge.TRUST_ALL_HTTP.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() == 200) return "通过";
            return "错误 " + resp.statusCode();
        } catch (Exception e) {
            return "连接失败";
        }
    }

    private static byte[] createSilenceWav(int sampleRate, int durationMs) {
        int numSamples = sampleRate * durationMs / 1000;
        int dataSize = numSamples * 2;
        byte[] wav = new byte[44 + dataSize];
        wav[0] = 82; wav[1] = 73; wav[2] = 70; wav[3] = 70;
        writeIntLE(wav, 4, 36 + dataSize);
        wav[8] = 87; wav[9] = 65; wav[10] = 86; wav[11] = 69;
        wav[12] = 102; wav[13] = 109; wav[14] = 116; wav[15] = 32;
        writeIntLE(wav, 16, 16);
        writeShortLE(wav, 20, (short) 1);
        writeShortLE(wav, 22, (short) 1);
        writeIntLE(wav, 24, sampleRate);
        writeIntLE(wav, 28, sampleRate * 2);
        writeShortLE(wav, 32, (short) 2);
        writeShortLE(wav, 34, (short) 16);
        wav[36] = 100; wav[37] = 97; wav[38] = 116; wav[39] = 97;
        writeIntLE(wav, 40, dataSize);
        return wav;
    }

    private static void writeIntLE(byte[] b, int off, int v) {
        b[off] = (byte) v;
        b[off + 1] = (byte) (v >> 8);
        b[off + 2] = (byte) (v >> 16);
        b[off + 3] = (byte) (v >> 24);
    }

    private static void writeShortLE(byte[] b, int off, short v) {
        b[off] = (byte) v;
        b[off + 1] = (byte) (v >> 8);
    }

    public static void openBrowser(String url) {
        try {
            String os = System.getProperty("os.name").toLowerCase();
            if (os.contains("win")) {
                Runtime.getRuntime().exec(new String[]{"rundll32", "url.dll,FileProtocolHandler", url});
            } else if (os.contains("mac")) {
                Runtime.getRuntime().exec(new String[]{"open", url});
            } else {
                Runtime.getRuntime().exec(new String[]{"xdg-open", url});
            }
        } catch (Exception e) {
            System.out.println("[VeritySetup] openBrowser: " + e.getMessage());
        }
    }
}
