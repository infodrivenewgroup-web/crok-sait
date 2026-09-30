export function pageHead(title: string, description: string, path: string, originRaw: string) {
  const origin = originRaw.replace(/\/$/, "");
  const url = origin ? `${origin}${path}` : path;
  const image = origin ? `${origin}/og.jpg` : "/og.jpg";
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "ru-RU",
        isPartOf: { "@type": "WebSite", name: "Check-Love", url: origin ? `${origin}/` : "/" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: origin ? `${origin}/` : "/" },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  }).replace(/</g, "\\u003c");
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:site_name", content: "Check-Love" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
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
}
