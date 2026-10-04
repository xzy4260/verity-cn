import type { Metadata } from "next";
import { getT } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import { type LocaleCode, isLocaleCode, isPrefixedLocale, DEFAULT_LOCALE, localePath, altLanguages, SITE_URL } from "@/lib/i18n";
import { DocsCommandsView } from "@/components/views/docs-commands";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: LocaleCode = isLocaleCode(locale) ? locale : DEFAULT_LOCALE;
  const t = getT(l);
  return {
    title: t("docs-commands.001"),
    description: t("docs-commands.002"),
    alternates: {
      canonical: SITE_URL + localePath(l, "/docs/commands"),
      languages: altLanguages("/docs/commands"),
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
  return <DocsCommandsView locale={locale} />;
}
