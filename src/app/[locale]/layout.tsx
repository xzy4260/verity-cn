import { notFound } from "next/navigation";
import { getT, getMessages } from "@/lib/dictionary";
import { SITE_URL, localePath, type LocaleCode, OG_LOCALE, DEFAULT_LOCALE, isLocaleCode, isPrefixedLocale, PREFIXED_LOCALES } from "@/lib/i18n";
import { JsonLd } from "@/components/json-ld";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: LocaleCode = isLocaleCode(locale) ? locale : DEFAULT_LOCALE;
  const t = getT(l);
  const title = t("layout.001");
  const description = t("layout.002");
  return {
    title: { default: title, template: "%s — Verity-cn" },
    description,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[l],
      siteName: "Verity-cn",
      title,
      description,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocaleCode(locale) || !isPrefixedLocale(locale)) notFound();

  return (
    <LocaleProvider locale={locale} messages={getMessages(locale)}>
      <JsonLd description={getT(locale)("layout.007")} downloadUrl={SITE_URL + localePath(locale, "/download")} />
      <SiteHeader />
      {children}
    </LocaleProvider>
  );
}
