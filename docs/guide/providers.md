# 支持免费调用的 AI 服务商

Verity 的 LLM / TTS / STT 均走 **OpenAI 兼容协议**。如果你不想用 DeepSeek、豆包的付费通道，或者想试用不同的模型，可以使用下面这些**目前提供免费额度**的服务商。

它们都通过「高级配置 → 关闭『启用 Verity Mod 配置』→ 填自定义 Base URL + API Key + 模型名」的方式接入（详见 [高级自定义配置](/guide/advanced#llm-tts-stt) 与 [本地 AI 支持与 Base URL 填写规范](/guide/advanced#本地-ai-支持与-base-url-填写规范)）。

::: warning 填写前必读
- **Base URL 只填基础地址**（通常以 `/v1` 结尾，不绝对），**不要**填完整补全地址（如 `.../v1/chat/completions`），否则后端自动拼接会失败。
- 各家的**免费政策随时可能调整**（限流、下线、转付费），以官网实时公告为准。
- 免费接口稳定性通常不如付费通道，遇到 `429`（限流）或 `5xx`（服务端错误）属正常现象，详见 [AI 错误码](/guide/errors)。
- 所有 API Key 等同于账号密码，切勿泄露（见 [配置 Verity - Key 泄露提醒](/guide/config#_3-添加-api-密钥)）。
:::

---

## OpenRouter

| 项目 | 内容 |
|------|------|
| 免费情况 | 每天有限额（免费档约 50 次/天，覆盖 25+ 免费模型），轻度使用足够 |
| 官网 | https://openrouter.ai/ |
| 获取 Key | 注册 → Settings → Keys → 创建（Key 以 `sk-or-` 开头） |
| Base URL | `https://openrouter.ai/api/v1` |
| 推荐模型 | `openrouter/free` |

> 💡 **`openrouter/free` 是什么**：它是一个**聚合路由模型名**，后端会自动把请求路由到当前所有可用的免费模型，你无需手动挑选某个具体模型。想要指定模型时也可用 `anthropic/claude-...`、`deepseek/deepseek-chat` 等标准 slug。

---

## NVIDIA NIM

| 项目 | 内容 |
|------|------|
| 免费情况 | 基本全免费（NVIDIA 开发者计划提供免费额度），但**不同模型体验有割裂** |
| 官网 | https://build.nvidia.com/explore/discover |
| 获取 Key | 选任意模型卡片 → Get API Key（Key 以 `nvapi-` 开头） |
| Base URL | `https://integrate.api.nvidia.com/v1` |
| 推荐模型 | `nvidia/nemotron-3-ultra-550b-a55b` |

> 体验割裂是 NIM 多模型目录的固有现象（不同模型来自不同上游、能力参差），建议先用上面推荐的 Nemotron 模型，不行再换。

---

## Agnes

| 项目 | 内容 |
|------|------|
| 免费情况 | 基本完全免费 |
| 官网 | https://platform.agnes-ai.com/ |
| 获取 Key | 注册后在平台复制 API Key（形如 `sk-...`，**不要带 `Bearer ` 前缀**） |
| Base URL | `https://apihub.agnes-ai.com/v1` |
| 推荐模型 | `agnes-2.0-flash`（或更新的 `agnes-2.5-flash`） |

---

## OpenCode Zen

| 项目 | 内容 |
|------|------|
| 免费情况 | 提供一组免费模型，**每天有限额**（具体额度未知，且可能随时调整） |
| 官网 | https://opencode.ai/auth |
| 获取 Key | 注册登录 → Create API Key |
| Base URL | `https://opencode.ai/zen/v1` |
| 推荐模型 | 免费模型如 `mimo-v2.5-free`、`deepseek-v4-flash-free`、`nemotron-3-super-free` 等 |

> 可用 `GET https://opencode.ai/zen/v1/models` 查看当前完整模型列表（含免费与付费）。免费模型性能和稳定性可能不如付费模型。

---

## Cloudflare Workers AI

| 项目 | 内容 |
|------|------|
| 免费情况 | Workers AI 每天有免费额度（需 Cloudflare 账号） |
| 官网 | https://dash.cloudflare.com/ |
| 获取信息 | 在 Cloudflare 控制台获取 **Account ID** 和具备 Workers AI 读取权限的 **API Token** |
| Base URL | `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1`（将 `{account_id}` 换成你的账户 ID） |
| 推荐模型 | Workers AI 模型，如 `@cf/meta/llama-3.1-8b-instruct` |

> ⚠️ Cloudflare 的 Base URL 需要嵌入你的 **Account ID**，配置比其他家稍复杂；免费额度按天限制。模型名需带 `@cf/` 前缀。

---

## 小结与接入提醒

1. 以上接口都接在「自定义 API / 关闭启用 Verity Mod 配置」路径下，填入 **Base URL + API Key + 模型名** 即可（TTS / STT 若支持同理）。
2. 填完建议点配置界面底部的 **刷新** 跑连通性检测；免费通道若检测失败多为限流或临时不可用，可换模型或稍后重试。
3. 若只想开箱即用、省心稳定，仍推荐走 Verity Mod 网站的 **DeepSeek / 豆包付费通道**（见 [配置 Verity](/guide/config)）。

> 📌 本文档撰写时（2026-08）以上信息经核对；服务商政策变动请以官网为准。
