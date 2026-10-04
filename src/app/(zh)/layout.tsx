import { SITE_URL } from "@/lib/i18n";
import { JsonLd } from "@/components/json-ld";
import { getMessages, getT } from "@/lib/dictionary";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";
import { LocaleAutoRedirect } from "@/components/locale-auto-redirect";

/** 简体中文分支：不带语言前缀，沿用原有 URL */
export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider locale="zh-CN" messages={getMessages("zh-CN")}>
      <JsonLd description={getT("zh-CN")("layout.007")} downloadUrl={SITE_URL + "/download"} />
      <LocaleAutoRedirect />
      <SiteHeader />
      {children}
    </LocaleProvider>
  );
}
