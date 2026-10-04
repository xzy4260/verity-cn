import { notFound } from "next/navigation";
import { type LocaleCode, isLocaleCode, isPrefixedLocale } from "@/lib/i18n";
import { HomeView } from "@/components/views/home";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocaleCode(locale) || !isPrefixedLocale(locale)) notFound();
  return <HomeView locale={locale} />;
}
