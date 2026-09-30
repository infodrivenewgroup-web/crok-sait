import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { BlogArticle, BlogIndex, blogIndexJsonLd } from "@/components/check-love/BlogPages";
import { NotFoundPage } from "@/components/check-love/NotFoundPage";
import { articleBySlug, publishedArticles } from "@/lib/check-love/articles";
import { getSiteOrigin } from "@/lib/check-love/origin";

export const Route = createFileRoute("/blog")({
  loader: async () => {
    const origin = await getSiteOrigin().catch(() => "");
    return { origin };
  },
  head: ({ matches, loaderData }) => {
    const onArticle = matches.some((item) => {
      const path = item.pathname.replace(/\/+$/, "");
      return path.startsWith("/blog/") && path.length > "/blog/".length;
    });
    if (onArticle) return {};
    const origin = (loaderData?.origin ?? "").replace(/\/$/, "");
    const url = origin ? `${origin}/blog` : "/blog";
    const image = origin ? `${origin}/og.jpg` : "/og.jpg";
    const title = "Блог Check-Love: проверка на верность по открытым данным";
    const description =
      "Статьи о том, как спокойно проверить партнёра по открытым данным: соцсети, номер, Telegram и границы без взлома.";
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
        { property: "og:image:alt", content: title },
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
      scripts: origin ? [{ type: "application/ld+json", children: blogIndexJsonLd(publishedArticles(), origin) }] : [],
    };
  },
  component: BlogRoute,
});

function BlogRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const slug = articleSlug(pathname);
  if (slug) {
    const article = articleBySlug(slug) ?? articleBySlug(decodeURIComponent(slug));
    if (article) return <BlogArticle article={article} />;
    return <NotFoundPage />;
  }
  return <BlogIndex />;
}

function articleSlug(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (!path.startsWith("/blog/")) return "";
  const slug = path.slice("/blog/".length);
  if (!slug || slug.includes("/")) return "";
  return slug;
}
