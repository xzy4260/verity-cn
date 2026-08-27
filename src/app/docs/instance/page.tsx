import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, Step } from "@/components/docs-ui";
import { PlatformTabs } from "@/components/platform-tabs";

export const metadata: Metadata = {
  title: "配置并启动实例",
  description: "在启动器中创建 Minecraft 实例、安装 Verity-cn 模组并完成首次启动。",
  alternates: { canonical: "https://verity-cn.pages.dev/docs/instance" },
};

function Shot({
  src,
  alt,
  w,
  h,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      className="w-full h-auto rounded-xl border shadow-sm"
    />
  );
}

/** 行内 UI 图标（小房子 / 齿轮 / 下载等） */
function Icon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={140}
      height={140}
      className="mx-0.5 inline-block size-6 rounded-md border align-middle"
    />
  );
}

export default function InstanceGuidePage() {
  const header = (
    <>
      <Badge variant="secondary" className="mb-3">新手教程</Badge>
      <h1 className="text-3xl font-semibold tracking-tight">
        配置并启动 Verity-cn 实例
      </h1>
      <p className="mt-3 text-muted-foreground">
        本篇将带你创建 Minecraft 1.20.1 + Forge 实例、安装前置模组并导入
        Verity-cn，最后启动游戏。教程分为 Windows 与 Android
        两个平台，页面会根据你的设备自动选择，也可以手动切换。
      </p>
    </>
  );

  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <PlatformTabs
        header={header}
        windows={
          <>
            <Reveal>
              <p className="text-muted-foreground">
                Windows 平台使用 XMCL：创建 Forge 1.20.1
                实例，并安装 Verity-cn 与前置模组。如果你还没有安装并配置好
                XMCL 启动器，请先阅读{" "}
                <Link href="/docs/play" className="font-medium text-primary hover:underline">
                  如何游玩 Minecraft（Java 版）
                </Link>
                。
              </p>
              <Callout tone="info">
                v3.4 及之后的 Verity-cn 均使用 Java 17 编译，一般无需关注 JAVA
                版本——启动器会自动下载并处理所需的运行环境。
              </Callout>
            </Reveal>

            <div className="mt-12 space-y-14">
              <Reveal delay={40}>
                <Step n={1} id="create" title="新建实例">
                  <p>打开 XMCL，点击左侧的 <span className="font-medium text-foreground">+ 号</span>新建实例：</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Minecraft 版本选择 <span className="font-medium text-foreground">1.20.1</span>；</li>
                    <li>
                      模组加载器再选 <span className="font-medium text-foreground">Forge</span>，这样会自动匹配适用于
                      1.20.1 的最新版 Forge；
                    </li>
                    <li>搞定后点击右下角的创建按钮并安装。</li>
                  </ol>
                  <Shot
                    src="/docs/instance/instance-create.png"
                    alt="XMCL 实例创建界面：版本 1.20.1 加 Forge"
                    w={1200}
                    h={720}
                  />
                  <Callout tone="info">
                    等待安装完成期间，可以先前往{" "}
                    <Link href="/download" className="font-medium text-primary hover:underline">
                      下载页
                    </Link>{" "}
                    下载最新版的 Verity-cn。
                  </Callout>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={2} id="mods" title="安装模组">
                  <p>回到实例主页，点击内容下的<span className="font-medium text-foreground">模组区域</span>：</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>
                      点击市场，搜索并下载 <span className="font-medium text-foreground">Cloth Config</span> 和{" "}
                      <span className="font-medium text-foreground">GeckoLib</span>；
                    </li>
                    <li>点回已安装页面，将下载好的 Verity-cn 拖动到下面的黄色框选区域；</li>
                    <li>稍等片刻，即可看到 Cloth Config、GeckoLib、Verity-cn 模组成功安装。</li>
                  </ol>
                  <video
                    controls
                    preload="metadata"
                    src="/docs/instance/mod.mp4"
                    className="w-full rounded-xl border shadow-sm"
                  />
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={3} id="launch" title="启动游戏">
                  <p>回到实例主页，点击启动即可启动成功。</p>
                  <Callout tone="success">
                    游戏启动成功！不过 Verity 还没有完成配置——首次进入带有 Verity-cn
                    Mod 的游戏时会弹出初始化配置，请继续阅读下一篇
                    <Link href="/docs/verity-config" className="mx-1 font-medium hover:underline">
                      Verity 初始化配置
                    </Link>
                    。
                  </Callout>
                </Step>
              </Reveal>
            </div>
          </>
        }
        android={
          <>
            <Reveal>
              <p className="text-muted-foreground">
                Android 平台使用 ZL2 启动器完成同样的流程：下载 Minecraft 1.20.1 与
                Forge、安装前置模组并导入 Verity-cn。如果你还没有安装
                ZL2，请先阅读{" "}
                <Link href="/docs/play" className="font-medium text-primary hover:underline">
                  如何游玩 Minecraft（Java 版）
                </Link>{" "}
                的 Android 部分。
              </p>
            </Reveal>

            <div className="mt-12 space-y-14">
              <Reveal delay={40}>
                <Step n={1} id="dl-game" title="下载游戏与 Forge">
                  <p>
                    回到 ZL2 主页，点击右上角的下载图标{" "}
                    <Icon
                      src="/docs/instance-android/zl2-mcdl.jpg"
                      alt="ZL2 右上角的下载图标"
                    />
                    ，进入资源下载界面：
                  </p>
                  <ol className="list-decimal space-y-4 pl-5">
                    <li>
                      往下滑找到{" "}
                      <span className="font-medium text-foreground">1.20.1</span>{" "}
                      并点击；
                      <Shot
                        src="/docs/instance-android/zl2-mcv.jpg"
                        alt="ZL2 资源下载界面的版本列表，选择 1.20.1"
                        w={2400}
                        h={1080}
                      />
                    </li>
                    <li>
                      接着点击{" "}
                      <span className="font-medium text-foreground">Forge</span>
                      ，选择最新版本；
                      <Shot
                        src="/docs/instance-android/zl2-forge.jpg"
                        alt="ZL2 中选择最新版 Forge"
                        w={2400}
                        h={1080}
                      />
                    </li>
                    <li>
                      然后点击右上角的下载按钮{" "}
                      <Icon
                        src="/docs/instance-android/zl2-mcdl.jpg"
                        alt="ZL2 右上角的下载图标"
                      />
                      。
                    </li>
                  </ol>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={2} id="wait-dl" title="等待下载安装">
                  <p>点击下载后耐心等待，下载中与安装完成的界面分别如下：</p>
                  <Shot
                    src="/docs/instance-android/zl2-downloading.jpg"
                    alt="ZL2 下载进度界面"
                    w={847}
                    h={1001}
                  />
                  <Shot
                    src="/docs/instance-android/zl2-done.jpg"
                    alt="ZL2 下载安装完成界面"
                    w={765}
                    h={505}
                  />
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={3} id="install-mods" title="安装前置模组">
                  <p>
                    点击左侧 TAB 中的<span className="font-medium text-foreground">模组</span>按钮，
                    在右上角依次搜索{" "}
                    <span className="font-medium text-foreground">Cloth Config</span>{" "}
                    和{" "}
                    <span className="font-medium text-foreground">GeckoLib</span>
                    。这里以 Cloth Config 的安装为例：
                  </p>
                  <ol className="list-decimal space-y-4 pl-5">
                    <li>
                      搜索并点击 Cloth Config 后，选择{" "}
                      <span className="font-medium text-foreground">1.20.1</span>{" "}
                      版本（一般会自动跳转），然后点击第一个结果；
                      <Shot
                        src="/docs/instance-android/zl2-mod-search.jpg"
                        alt="ZL2 模组市场中搜索 Cloth Config"
                        w={2400}
                        h={1080}
                      />
                      <Shot
                        src="/docs/instance-android/zl2-mod-select.jpg"
                        alt="选择 1.20.1 版本的 Cloth Config 并点击第一个结果"
                        w={2400}
                        h={1080}
                      />
                    </li>
                    <li>
                      选择刚刚下载好的 Minecraft 1.20.1 Forge
                      实例（默认已选中），点击安装；
                      <Shot
                        src="/docs/instance-android/zl2-mod-install.jpg"
                        alt="选择 1.20.1 Forge 实例并安装 Cloth Config"
                        w={1126}
                        h={547}
                      />
                    </li>
                    <li>GeckoLib 如法炮制即可。</li>
                  </ol>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={4} id="import-verity" title="导入 Verity-cn">
                  <p>
                    点击左上角的小房子图标{" "}
                    <Icon
                      src="/docs/instance-android/zl2-home.jpg"
                      alt="ZL2 左上角的主页图标"
                    />{" "}
                    回到主页，再点击右下角的齿轮图标{" "}
                    <Icon
                      src="/docs/instance-android/zl2-settings.jpg"
                      alt="ZL2 右下角的设置齿轮图标"
                    />{" "}
                    打开实例配置。
                  </p>
                  <p>
                    然后点击左下角 TAB 中的
                    <span className="font-medium text-foreground">模组管理</span>
                    ，再点右上角的<span className="font-medium text-foreground">导入</span>按钮：
                  </p>
                  <Shot
                    src="/docs/instance-android/zl2-mod-manage.jpg"
                    alt="ZL2 实例配置中的模组管理与导入按钮"
                    w={2400}
                    h={1080}
                  />
                  <p>
                    此时会打开 Android 自带的文件选择器，自行选择下载好的{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      Verity-cn-版本号.jar
                    </code>{" "}
                    导入即可。
                  </p>
                  <Shot
                    src="/docs/instance-android/file-picker.jpg"
                    alt="Android 文件选择器中选择 Verity-cn 的 jar 包"
                    w={1080}
                    h={1247}
                  />
                  <Callout tone="warn">
                    配图中的目录仅为演示目录，请选择你实际保存 Verity-cn
                    的下载目录。
                  </Callout>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={5} id="start-android" title="启动游戏">
                  <p>
                    再次点击小房子图标{" "}
                    <Icon
                      src="/docs/instance-android/zl2-home.jpg"
                      alt="ZL2 左上角的主页图标"
                    />{" "}
                    回到主页，点击右下角的「启动游戏」即可启动成功。
                  </p>
                  <Callout tone="success">
                    游戏启动成功！不过 Verity 还没有完成配置——首次进入带有 Verity-cn
                    Mod 的游戏时会弹出初始化配置，请继续阅读下一篇
                    <Link href="/docs/verity-config" className="mx-1 font-medium hover:underline">
                      Verity 初始化配置
                    </Link>
                    。
                  </Callout>
                </Step>
              </Reveal>
            </div>
          </>
        }
      />
    </main>
  );
}
