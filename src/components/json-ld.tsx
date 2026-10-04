import { SITE_URL } from "@/lib/i18n";

/** 站点结构化数据（随语言变化，故由各语言分支布局分别渲染） */
export function JsonLd({
  description,
  downloadUrl,
}: {
  description: string;
  downloadUrl: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Verity-cn",
          applicationCategory: "GameApplication",
          operatingSystem: "Windows, Android",
          description,
          url: SITE_URL,
          downloadUrl,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "CNY",
          },
        }),
      }}
    />
  );
}
