import type { Metadata } from "next";
import { getT } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import { type LocaleCode, isLocaleCode, isPrefixedLocale, DEFAULT_LOCALE, localePath, altLanguages, SITE_URL } from "@/lib/i18n";
import { DocsFreeLlmView } from "@/components/views/docs-free-llm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: LocaleCode = isLocaleCode(locale) ? locale : DEFAULT_LOCALE;
  const t = getT(l);
  return {
    title: t("docs-free-llm.001"),
    description: t("docs-free-llm.002"),
    alternates: {
      canonical: SITE_URL + localePath(l, "/docs/free-llm"),
      languages: altLanguages("/docs/free-llm"),
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
  return <DocsFreeLlmView locale={locale} />;
}
