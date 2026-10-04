import type { Metadata } from "next";
import { getT } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import { type LocaleCode, isLocaleCode, isPrefixedLocale, DEFAULT_LOCALE, localePath, altLanguages, SITE_URL } from "@/lib/i18n";
import { DocsInstanceView } from "@/components/views/docs-instance";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: LocaleCode = isLocaleCode(locale) ? locale : DEFAULT_LOCALE;
  const t = getT(l);
  return {
    title: t("docs-instance.001"),
    description: t("docs-instance.002"),
    alternates: {
      canonical: SITE_URL + localePath(l, "/docs/instance"),
      languages: altLanguages("/docs/instance"),
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocaleCode(locale) || !isPrefixedLocale(locale)) notFound();
  return <DocsInstanceView locale={locale} />;
}
