import { notFound, redirect } from "next/navigation";
import { type LocaleCode, isLocaleCode, isPrefixedLocale } from "@/lib/i18n";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocaleCode(locale) || !isPrefixedLocale(locale)) notFound();
  redirect(`/${locale}/docs/play`);
}
