/**
 * GitHub 加速镜像前缀清单。
 *
 * 用法：`base + <GitHub 原始链接>`，例如
 *   https://gh-proxy.com/https://github.com/xzy4260/verity-cn/releases/download/v3.4/verity-cn-v3.4.jar
 */
export type Mirror = {
  /** 完整前缀，以 / 结尾 */
  base: string;
  /** 展示用域名 */
  host: string;
};

const MIRROR_BASES: string[] = [
  "https://gh.b52m.cn/",
  "https://git.tangbai.cc/",
  "https://github.chenc.dev/",
  "https://git.yylx.win/",
  "https://gh-proxy.com/",
  "https://gh.padao.fun/",
  "https://ghm.078465.xyz/",
  "https://gh.halonicc.com/",
  "https://github.cnxiaobai.com/",
  "https://gh.ddlc.top/",
  "https://jiashu.1win.eu.org/",
  "https://gh.catmak.name/",
  "https://ghproxy.sakuramoe.dev/",
  "https://ghproxy.mirror.skybyte.me/",
  "https://ghproxy.xzhouqd.com/",
  "https://github.mlmlm.cn/",
  "https://ghp.keleyaa.com/",
  "https://ghf.无名氏.top/",
  "https://tvv.tw/",
  "https://gh.aaa.team/",
  "https://gh.198962.xyz/",
  "https://gitproxy.mrhjx.cn/",
  "https://gh.nxnow.top/",
  "https://gh.idayer.com/",
  "https://gh.39.al/",
  "https://gh.1k.ink/",
  "https://ghfile.geekertao.top/",
  "https://gh.dpik.top/",
  "https://ghproxy.cxkpro.top/",
  "https://github.zzrbk.xyz/",
  "https://gh.996986.xyz/",
  "https://gitproxy.127731.xyz/",
  "https://free.cn.eu.org/",
  "https://git.4060981.xyz/",
  "https://y.whereisdoge.work/",
  "https://getgit.love8yun.eu.org/",
  "https://git.951959483.xyz/",
  "https://github.crdz.eu.org/",
  "https://github.dpik.top/",
  "https://github.geekery.cn/",
  "https://github.boringhex.top/",
  "https://30006000.xyz/",
  "https://hub.ddayh.com/",
  "https://ghproxy.imciel.com/",
  "https://github.1ms.xx.kg/",
  "https://fastgit.cc/",
  "https://github.lsdfxdk.nyc.mn/",
  "https://github.ihnic.com/",
  "https://proxy.baguoyuyan.com/",
  "https://github.ednovas.xyz/",
  "https://g.blfrp.cn/",
  "https://gh.chjina.com/",
  "https://xiaomo-station.top/",
  "https://github.788787.xyz/",
  "https://github.880824.xyz/",
  "https://github-proxy.lixing.top/",
  "https://gh.shiina-rimo.cafe/",
  "https://ghfast.top/",
  "https://gp.871201.xyz/",
  "https://github.tianrld.top/",
  "https://kenyu.ggff.net/",
  "https://ghpxy.hwiznziej.top/",
  "https://gh.con.sh/",
  "https://git.820828.xyz/",
  "https://ghproxy.053000.xyz/",
  "https://gh.monlor.com/",
  "https://gh.noki.icu/",
  "https://ghproxy.net/",
  "https://ghps.cc/",
  "https://down.npee.cn/",
  "https://ggg.clwap.dpdns.org/",
  "https://ghproxy.cn/",
  "https://github-proxy.memory-echoes.cn/",
  "https://github.xxlab.tech/",
  "https://gitproxy1.127731.xyz/",
  "https://git.669966.xyz/",
  "https://www.5555.cab/",
  "https://ghproxy.monkeyray.net/",
];

export const MIRRORS: Mirror[] = MIRROR_BASES.map((base) => ({
  base,
  host: base.replace(/^https?:\/\//, "").replace(/\/+$/, ""),
}));

/** 延迟探测用的小文件（约 845 B，走 GitHub Raw） */
export const PROBE_URL =
  "https://raw.githubusercontent.com/xzy4260/verity-cn/main/README.md";

export type Netdisk = {
  name: string;
  url: string;
  note: string;
  icon: string;
  revenue?: boolean;
};

/** 网盘分流（夸克 / UC 为收益渠道） */
export const netdisksOf = (t: (k: string) => string): Netdisk[] => [
  { name: t("data-mirrors.003"), url: "https://pan.quark.cn/s/1064a79d1a04", note: t("data-mirrors.004"), icon: "/mirrors/quark.png", revenue: true },
  { name: t("data-mirrors.005"), url: "https://drive.uc.cn/s/9ebc5dcc7d004?public=1", note: t("data-mirrors.004"), icon: "/mirrors/uc.png", revenue: true },
  { name: t("data-mirrors.007"), url: "https://1846104117.share.123pan.cn/123pan/iTh6Td-cFRmA", note: t("data-mirrors.004"), icon: "/mirrors/123pan.png" },
  { name: t("data-mirrors.009"), url: "https://pan.baidu.com/s/1PhLz70wBtQ9JeKxcnL6HPw?pwd=4260", note: t("data-mirrors.010"), icon: "/mirrors/baidu.png" },
  { name: t("data-mirrors.011"), url: "https://www.guangyapan.com/s/1935342246296858628_an8FiodyMIxHWiSF", note: t("data-mirrors.004"), icon: "/mirrors/guangya.png" },
  { name: t("data-mirrors.013"), url: "https://yun.139.com/shareweb/#/w/i/2wFGyiL9v9hlp", note: t("data-mirrors.014"), icon: "/mirrors/mobile.png" },
  { name: t("data-mirrors.015"), url: "https://cloud.189.cn/web/share?code=U7rumuN3QvEj", note: t("data-mirrors.016"), icon: "/mirrors/tianyi.ico" },
];

export type MoePalBuild = { platform: string; url: string; code: string };

export const MOEPAL_ICON = "/mirrors/moepal.png";

export const MOEPAL: MoePalBuild[] = [
  { platform: "Windows", url: "https://xzy4260.lanzoul.com/b01d7a08zg", code: "b2pj" },
  { platform: "Android", url: "https://xzy4260.lanzoul.com/b01d7a090h", code: "b7g5" },
  { platform: "macOS", url: "https://xzy4260.lanzoul.com/b01d7a093a", code: "18yy" },
];
