# LLM 对话配置

Verity 的 AI 对话使用 OpenAI 兼容 API。

## 配置项

| 设置 | 说明 | 默认值 |
|------|------|--------|
| 启用 LLM | 总开关 | true |
| API 基础 URL | OpenAI 兼容端点 | `https://api.xiaomimimo.com/v1` |
| API 密钥 | 认证令牌 | - |
| 模型 | 模型名称 | `mimo-v2.5` |
| 系统提示词 | 角色设定 | 内置中文提示词 |

## 兼容的 API 提供商

任何支持 OpenAI Chat Completions 格式的 API 都可以使用：

- **小米 MiMo**（推荐）：`https://api.xiaomimimo.com/v1`
- **OpenAI**：`https://api.openai.com/v1`
- **DeepSeek**：`https://api.deepseek.com/v1`
- **自定义代理**：本地 Ollama / vLLM 等

## 验证连接

配置 API 后，右键点击 Verity 对话，如果能正常回复即表示连接成功。

如果失败，检查：
1. Base URL 是否以 `/v1` 结尾
2. API Key 是否正确
3. 网络是否能访问该端点
