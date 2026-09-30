import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckLoveApp } from "@/components/check-love/CheckLoveApp";
import { FAQ } from "@/lib/check-love/content";
import { getSiteOrigin, legacyView } from "@/lib/check-love/origin";

const TITLE = "Анонимная проверка на верность. Анонимно, Без регистрации.";
const HOME_DESCRIPTION = "Узнай правду за 5 минут - Анонимно, Безопасно, Быстро.";
const DESCRIPTION =
  "Анонимная проверка по номеру или странице VK. Только открытые данные: без взлома, без пароля и без уведомления партнёру. Отчёт доступен сразу после оплаты по СБП.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const view = await legacyView().catch(() => "");
    if (view === "reviews") throw redirect({ href: "/reviews", statusCode: 301 });
    if (view === "examples") throw redirect({ href: "/examples", statusCode: 301 });
    return { origin: await getSiteOrigin().catch(() => "") };
  },
  head: ({ loaderData }) => {
    const origin = (loaderData?.origin ?? "").replace(/\/$/, "");
    const url = origin ? `${origin}/` : "/";
    const image = origin ? `${origin}/og.jpg` : "/og.jpg";
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: TITLE,
          description: HOME_DESCRIPTION,
          inLanguage: "ru-RU",
          isPartOf: { "@type": "WebSite", name: "Check-Love", url },
        },
        {
          "@type": "Service",
          name: "Анонимная проверка по открытым данным",
          serviceType: "Аналитика открытых источников",
          provider: { "@type": "Organization", name: "Check-Love", sameAs: "https://t.me/ChekLoveService" },
          areaServed: "RU",
          description: DESCRIPTION,
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    }).replace(/</g, "\\u003c");
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: HOME_DESCRIPTION },
        { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ru_RU" },
        { property: "og:site_name", content: "Check-Love" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: HOME_DESCRIPTION },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: TITLE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: HOME_DESCRIPTION },
        { name: "twitter:image", content: image },
        { name: "twitter:url", content: url },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", href: url, hrefLang: "ru" },
        { rel: "alternate", href: url, hrefLang: "x-default" },
      ],
      scripts: [{ type: "application/ld+json", children: jsonLd }],
    };
  },
  component: Home,
});

function Home() {
  return <CheckLoveApp />;
}
