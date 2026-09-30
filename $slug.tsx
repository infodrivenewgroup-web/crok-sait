import { createFileRoute } from '@tanstack/react-router'
import { missingPage } from "@/components/check-love/NotFoundPage";
import { CheckLoveApp } from "@/components/check-love/CheckLoveApp";
import { landingBySlug, relatedLandings } from "@/lib/check-love/landings";
import { getSiteOrigin } from "@/lib/check-love/origin";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const page = landingBySlug(params.slug);
    if (!page) missingPage();
    const origin = await getSiteOrigin().catch(() => "");
    return {
      ...page,
      origin,
      related: relatedLandings(page.slug, 8).map((item) => ({ slug: item.slug, title: item.title })),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const origin = loaderData.origin.replace(/\/$/, "");
    const path = `/${loaderData.slug}`;
    const url = origin ? `${origin}${path}` : path;
    const image = origin ? `${origin}/og.jpg` : "/og.jpg";
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: loaderData.title,
          description: loaderData.description,
          inLanguage: "ru",
          isPartOf: { "@type": "WebSite", name: "Check-Love", url: origin ? `${origin}/` : "/" },
          primaryImageOfPage: image,
          about: {
            "@type": "Service",
            name: loaderData.title,
            description: loaderData.description,
            areaServed: "RU",
            provider: { "@type": "Organization", name: "Check-Love", sameAs: "https://t.me/ChekLoveService" },
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: origin ? `${origin}/` : "/" },
            { "@type": "ListItem", position: 2, name: loaderData.title, item: url },
          ],
        },
      ],
    }).replace(/</g, "\\u003c");
    return {
      meta: [
        { title: loaderData.title },
        { name: "description", content: loaderData.description },
        { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ru_RU" },
        { property: "og:site_name", content: "Check-Love" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: loaderData.title },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.description },
        { name: "twitter:image", content: image },
        { name: "twitter:url", content: url },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", href: url, hrefLang: "ru" },
      ],
      scripts: [{ type: "application/ld+json", children: jsonLd }],
    };
  },
  component: LandingRoute,
});

function LandingRoute() {
  const page = Route.useLoaderData();
  return <CheckLoveApp landing={page} />;
}
