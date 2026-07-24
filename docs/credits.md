# 致谢名单

Verity-cn 的发展离不开社区成员的支持与贡献。以下是为本项目提供过重要帮助的成员，在此致以最诚挚的感谢。

---

## 贡献者

### @涓星向凡 — Verity Mod 网站站长

<div class="credit-card">
  <div class="credit-card-header">
    <img class="credit-card-avatar" src="/avatar-juan.jpg" alt="涓星向凡" />
    <div class="credit-card-info">
      <h3>涓星向凡</h3>
      <span class="credit-card-tag">Verity Mod 网站支持和 API 支持</span>
      <a class="credit-card-link" href="https://space.bilibili.com/3461565078571133" target="_blank" rel="noopener">B站主页 ↗</a>
    </div>
  </div>
  <div class="credit-card-body">
    <p>作为 <strong>Verity Mod 网站</strong>的站长，涓星向凡为 v3.0 版本的<strong>网站深度集成</strong>提供了关键支持：</p>
    <ul>
      <li><strong>网站支持</strong>：搭建并维护 Verity Mod 网站，为模组提供了线上服务平台，用户可通过网站获取授权密钥与管理服务</li>
      <li><strong>API 支持</strong>：设计并实现 Verity Bridge 服务端 API，使模组能够通过统一的 Bridge 服务转发 LLM / TTS / STT 请求，实现零配置开箱即用</li>
      <li><strong>密钥体系</strong>：提供 License Key 授权机制，保障服务安全与用户管理</li>
    </ul>
    <p>v3.0 版本的核心更新——<strong>Verity Mod 网站深度集成</strong>，正是基于涓星向凡提供的网站与 API 基础设施才得以实现。</p>
  </div>
</div>

### @埋藏心底的悲伤 — 测试人员

<div class="credit-card">
  <div class="credit-card-header">
    <img class="credit-card-avatar" src="/avatar-beishang.jpg" alt="埋藏心底的悲伤" />
    <div class="credit-card-info">
      <h3>埋藏心底的悲伤</h3>
      <span class="credit-card-tag">测试人员</span>
    </div>
  </div>
  <div class="credit-card-body">
    <p>作为 verity-cn 项目的<strong>核心测试人员</strong>，埋藏心底的悲伤在 v3.0 版本开发期间做出了重要贡献：</p>
    <ul>
      <li><strong>积极参与 Beta 测试</strong>：在 v3.0 开发周期中，全程参与各阶段 Beta 版本的安装与功能测试，覆盖桌面端与安卓端双平台</li>
      <li><strong>及时反馈 Bug</strong>：在测试过程中发现并反馈了大量关键问题，包括 TTS 播放中断异常、聊天消息显示错误、配置项失效等，帮助开发者快速定位并修复缺陷</li>
      <li><strong>体验优化建议</strong>：从玩家实际使用角度提出多项改进建议，使模组的用户体验更加完善</li>
    </ul>
    <p>感谢埋藏心底的悲伤在百忙之中投入大量时间进行测试，为 v3.0 版本的质量保驾护航。每一个稳定版本的背后，都离不开测试人员的辛勤付出。</p>
  </div>
</div>

---

## 关于贡献

Verity-cn 是一个开源的 Minecraft 模组中国化项目，欢迎更多社区成员参与到开发、测试、文档编写和反馈中来。如果您也想为项目贡献一份力量，可以通过以下方式参与：

- **提交 Issue**：在 [GitHub 仓库](https://github.com/xzy4260/verity-cn) 提交 Bug 报告或功能建议
- **参与测试**：加入用户交流群，获取 Beta 版本并参与测试
- **反馈建议**：在 B站 视频评论区或用户群中分享您的使用体验和改进建议

每一个声音都被珍视，每一份贡献都被铭记。

<style>
.credit-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  padding: 28px;
  margin: 24px 0 36px;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.credit-card:hover {
  border-color: var(--v-accent-ring, rgba(139, 92, 246, 0.28));
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.12);
  transform: translateY(-2px);
}
.credit-card-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}
.credit-card-avatar {
  flex: 0 0 auto;
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid transparent;
  box-shadow: 0 0 0 2px var(--v-accent-ring, rgba(139, 92, 246, 0.28));
  transition: transform 0.25s ease;
}
.credit-card:hover .credit-card-avatar {
  transform: scale(1.05);
}
.credit-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.credit-card-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.credit-card-tag {
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--v-accent, #8b5cf6);
  padding: 2px 10px;
  border-radius: 6px;
  background: var(--v-accent-soft, rgba(139, 92, 246, 0.10));
}
.credit-card-link {
  font-size: 0.85rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  margin-top: 2px;
}
.credit-card-link:hover {
  text-decoration: underline;
}
.credit-card-body {
  color: var(--vp-c-text-2);
  line-height: 1.75;
}
.credit-card-body p {
  margin: 10px 0;
}
.credit-card-body ul {
  margin: 10px 0;
  padding-left: 22px;
}
.credit-card-body li {
  margin: 6px 0;
}
.credit-card-body strong {
  color: var(--vp-c-text-1);
}

@media (max-width: 720px) {
  .credit-card {
    padding: 20px;
  }
  .credit-card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
