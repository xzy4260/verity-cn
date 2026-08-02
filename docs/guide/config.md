# 配置 Verity

本模组使用由 **@涓星向凡**（[B站个人主页](https://space.bilibili.com/3461565078571133)）开发的 [Verity Mod 网站](https://veritycn.site/) 进行快捷配置。通过网站填写 API 密钥、生成配置，再回到游戏内完成授权，即可开玩。

## 1. 首次进入游戏

首次进入游戏会提示**初始化配置**，这是正常流程，按提示继续即可。

![首次进入提示初始化配置](/images/guide/config-init-prompt.png)

## 2. 注册并登录网站

1. 访问 [https://veritycn.site/](https://veritycn.site/) 打开网站，注册并登录账号。
2. 注册所需的**邀请码**可从以下 QQ 群的群公告获取：
   - **@xzy4260 的 QQ 群**：`1057631803`
   - **@涓星向凡 的 QQ 群**：`1076577219`

## 3. 添加 API 密钥

登录后，点击 **「API 密钥」** 添加自己的密钥。网站目前支持 **DeepSeek** 和 **豆包** 的快捷保存 Key。

![API 密钥页面 - 支持 DeepSeek / 豆包快捷保存](/images/guide/api-keys.png)

> ⚠️ **切勿泄露你的 API Key！**
>
> API Key 等同于你的**账号密码甚至钱包**——任何拿到它的人都能以你的名义调用接口并**直接产生扣费**。请务必：
> - **不要**把 Key 截图发到 QQ 群、评论区、视频、GitHub 等任何公开场合；
> - **不要**在直播、录屏、求助时把 Key 暴露在画面里（贴图前务必打码或裁剪）；
> - 若疑似泄露，立即到对应平台（DeepSeek / 豆包 / OpenAI 等）**吊销并重置 Key**；
> - 本站与模组**不会**以任何理由主动向你要 Key，凡索要 Key 的「客服」「官方」都是诈骗。

### 自定义 API

如需使用其他 OpenAI 兼容接口，点击**自定义 API**，依次填写：

- **名称**：方便辨识（例如「我的 DeepSeek」）
- **服务器 URL**：即 OpenAI 兼容的 Base URL（例如 `https://api.deepseek.com/v1`）
- **API Key**：你的密钥
- **模型列表**：点击「自动获取」

填写完毕后点击 **「保存」** 即可。

![自定义 API - 填写名称 / Base URL / Key 并自动获取模型](/images/guide/custom-api.png)

> 💡 没有 DeepSeek / 豆包 Key，或想试不同模型？可参考 [免费 AI 服务商](/guide/providers) 一文，里面整理了 OpenRouter、NVIDIA NIM、Agnes、OpenCode Zen、Cloudflare Workers AI 等目前提供免费额度的接口与接入参数。

## 4. 代理服务

点击 **「代理服务」**，在右侧选择**提供商**和**模型**。

![代理服务 - 选择提供商与模型](/images/guide/proxy-service.png)

> 💡 显示为 **付费** 的 DeepSeek 和豆包提供商，即对应上方 API 密钥快捷保存 Key 的通道；**免费通道接口不稳定，不保证稳定性与可用性**，建议优先使用付费通道。

## 5. 配置生成

点击 **「配置生成」**。这里有许多选项，但对 cn 版**只有「AI 设置」里的「语音」有效**，可在此设置音色。

![配置生成 - AI 设置中的语音 / 音色](/images/guide/config-gen-voice.png)

配置完毕后，建议点击下方的 **「刷新」** 按钮，确保配置已生效。

![点击下方的刷新按钮](/images/guide/refresh.png)

## 6. 回到游戏完成配置

回到游戏继续配置流程，**一路点击「是」**，最终会打开浏览器 **OAuth 登录页面**。

![浏览器 OAuth 登录页面](/images/guide/oauth-login.png)

点击 **「同意」** 授权即可。随后游戏内会**检测连通性**，全部通过就可以直接游戏了。

![游戏内连通性检测 - 全部通过](/images/guide/connectivity.png)

全部通过后，即可进入 [与 Verity 交互](/guide/interact) 开始游玩。
