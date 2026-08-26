import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, Step } from "@/components/docs-ui";
import { PlatformTabs } from "@/components/platform-tabs";

export const metadata: Metadata = {
  title: "如何游玩 Minecraft",
  description: "从零开始安装 Java、选择启动器、配置 Minecraft + Verity-cn 的完整流程。",
  alternates: { canonical: "https://verity-cn.com/docs/play" },
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

export default function PlayGuidePage() {
  const header = (
    <>
      <Badge variant="secondary" className="mb-3">新手教程</Badge>
      <h1 className="text-3xl font-semibold tracking-tight">
        如何游玩 Minecraft（Java 版）
      </h1>
      <p className="mt-3 text-muted-foreground">
        游玩 Minecraft Java
        版需要一个「启动器」。本篇教程提供 Windows 与 Android
        两个平台的指引，页面会根据你的设备自动选择，也可以手动切换。
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
                  Windows 平台我们推荐{" "}
                  <span className="font-medium text-foreground">XMCL</span>
                  ：此启动器外观新颖，错误日志可用 AI 纠错（需自行配置），还自带
                  P2P 组网联机，新手友好。本篇将一步步带你完成启动器的下载与配置，
                  配置完成后直接新建实例即可开始游戏。
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 gap-1.5"
                  render={
                    <a
                      href="https://xmcl.app/zh/"
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-3.5" />
                  打开 XMCL 官网
                </Button>
                <div className="mt-4">
                  <Callout tone="info">
                    你也可以使用其他主流启动器（如 PCL2、HMCL 等），但本站教程仅覆盖
                    XMCL，不会提供其他启动器的对应教程。请确保你有足够的探索力，或对所用启动器足够熟悉。
                  </Callout>
                </div>
              </Reveal>

              <div className="mt-12 space-y-14">
                <Reveal delay={40}>
                  <Step n={1} id="download" title="下载 XMCL">
                    <p>
                      打开官网{" "}
                      <a
                        href="https://xmcl.app/zh/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        xmcl.app/zh
                      </a>{" "}
                      并下滑到页面底部，即可找到各平台的下载链接。受国内网络原因影响，<span className="font-medium text-foreground">
                      建议选择下载压缩包</span>，而不是安装程序。
                    </p>
                    <Shot
                      src="/docs/xmcl/download.png"
                      alt="XMCL 官网页面底部的下载链接"
                      w={1176}
                      h={415}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={2} id="install" title="解压安装">
                    <p>
                      下载完成后，使用解压缩软件将压缩包解压到安装目录，即完成安装。
                    </p>
                    <video
                      controls
                      preload="metadata"
                      src="/docs/xmcl/extract.mp4"
                      className="w-full rounded-xl border shadow-sm"
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={3} id="init" title="首次运行与初始化">
                    <p>
                      进入解压后的目录，双击{" "}
                      <span className="font-medium text-foreground">
                        X Minecraft Launcher
                      </span>{" "}
                      即可打开程序。
                    </p>
                    <Callout tone="warn">
                      如果想在桌面访问：请在程序上右键创建快捷方式，再把快捷方式挪到桌面。<span className="font-medium">不要直接把程序文件本身挪到桌面。</span>
                    </Callout>
                    <p>第一次运行会提示进行初始化：</p>
                    <ol className="list-decimal space-y-4 pl-5">
                      <li>
                        选择语言，继续下一步。
                        <Shot
                          src="/docs/xmcl/init-language.png"
                          alt="XMCL 初始化：选择语言"
                          w={1200}
                          h={720}
                        />
                      </li>
                      <li>下一步选择深色或浅色主题。</li>
                      <li>
                        下一步选择数据目录——这个目录用来存放 Minecraft 的游戏文件。
                        <Shot
                          src="/docs/xmcl/data-dir.png"
                          alt="XMCL 初始化：选择数据目录"
                          w={1200}
                          h={720}
                        />
                        <div className="mt-3">
                          <Callout tone="info">
                            推荐选择 SSD（固态硬盘）作为数据目录而不是 HDD（机械硬盘），版本下载、资源加载都会更快。
                          </Callout>
                        </div>
                      </li>
                      <li>下一步登录正版账号；如果没有正版账号，可以先不登录。</li>
                    </ol>
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={4} id="dev-mode" title="开启开发者模式">
                    <p>
                      进入启动器后，点击左下角的设置，打开开发者模式。<span className="font-medium text-foreground">
                      开启开发者模式后，登录时才会有其他验证服务（离线模式、LittleSkin
                      等）可供选择。</span>
                    </p>
                    <Shot
                      src="/docs/xmcl/dev-mode.png"
                      alt="XMCL 设置中开启开发者模式"
                      w={1200}
                      h={720}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={5} id="account" title="登录账户">
                    <p>
                      回到主界面，点击左上角头像并选择登录，在验证服务的下拉列表中选择自己喜欢的登录方式即可（离线模式和
                      LittleSkin 登录等选项需已开启上一步的开发者模式才会显示）。
                    </p>
                    <Shot
                      src="/docs/xmcl/account.png"
                      alt="XMCL 账户设置中的验证服务选项"
                      w={1200}
                      h={720}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Callout tone="success">
                    启动器到这里就配置完毕了，接下来直接新建一个实例，就可以开始你的
                    Minecraft 之旅！
                  </Callout>
                </Reveal>
              </div>
            </>
        }
        android={
          <>
            <Reveal>
                <p className="text-muted-foreground">
                  Verity-cn 模组使用 Pojav
                  系的启动器理论上都可以正常体验。官方测试通过的是{" "}
                  <span className="font-medium text-foreground">ZL2</span>{" "}
                  启动器，本篇教程也均以 ZL2 为准；你也可以试试 FCL、HMCL
                  等，但我们不保障其稳定运行。
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 gap-1.5"
                  render={
                    <a
                      href="https://www.zalithlauncher.cn/download"
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-3.5" />
                  打开 ZL2 官方下载页
                </Button>
              </Reveal>

              <div className="mt-12 space-y-14">
                <Reveal delay={40}>
                  <Step n={1} id="dl-zl2" title="下载 ZL2">
                    <p>
                      打开 ZL2
                      官方下载页，选择与自己设备架构对应的版本下载。<span className="font-medium text-foreground">
                      若不清楚自己的设备架构，请下载以 arm64-v8a
                      结尾的版本</span>；如果安装失败，请下载以版本号为后缀结尾的安装包。
                    </p>
                    <Shot
                      src="/docs/android/zl2-dl.png"
                      alt="ZL2 官方下载页"
                      w={1470}
                      h={1155}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={2} id="zl2-init" title="安装与初始化">
                    <p>
                      安装完成后启动 ZL2，首次运行需要初始化，同意并安装即可；稍等片刻，初始化结束后就会进入启动器主页。
                    </p>
                    <Shot
                      src="/docs/android/zl2-init.jpg"
                      alt="ZL2 首次运行的初始化界面"
                      w={2400}
                      h={1080}
                    />
                    <Shot
                      src="/docs/android/zl2-home.jpg"
                      alt="ZL2 启动器主页"
                      w={2400}
                      h={1080}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={3} id="zl2-account" title="添加账号">
                    <p>点击主页的「添加账号」进入账号页面：</p>
                    <Shot
                      src="/docs/android/zl2-acc.jpg"
                      alt="ZL2 账号页面"
                      w={2400}
                      h={1080}
                    />
                    <p>
                      再次点击<span className="font-medium text-foreground">添加账号</span>——默认可以使用微软账号和离线登录；如要使用
                      LittleSkin 等皮肤站登录，点击
                      <span className="font-medium text-foreground">添加认证服务器</span>，服务器地址填写{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        https://littleskin.cn/api/yggdrasil
                      </code>{" "}
                      即可。
                    </p>
                    <Shot
                      src="/docs/android/zl2-addacc.jpg"
                      alt="ZL2 添加账号与认证服务器"
                      w={2400}
                      h={1080}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Callout tone="success">
                    到这里就可以新建实例开始游玩了！后续教程请继续阅读
                    <Link href="/docs/instance" className="mx-1 font-medium hover:underline">
                      配置并启动实例
                    </Link>
                    （同样提供 Android 版）与
                    <Link href="/docs/verity-config" className="mx-1 font-medium hover:underline">
                      Verity 初始化配置
                    </Link>
                    。
                  </Callout>
                </Reveal>
              </div>
            </>
        }
      />
    </main>
  );
}
