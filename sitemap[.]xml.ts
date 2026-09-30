import { createFileRoute } from "@tanstack/react-router";
import { publishedArticles } from "@/lib/check-love/articles";
import { LANDINGS } from "@/lib/check-love/landings";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const articles = publishedArticles();
        const pages = [
          { path: "/", priority: "1.0", lastmod: "2026-09-30", changefreq: "weekly" },
          { path: "/reviews", priority: "0.6", lastmod: "2026-09-30", changefreq: "weekly" },
          { path: "/examples", priority: "0.6", lastmod: "2026-09-30", changefreq: "weekly" },
          { path: "/blog", priority: "0.9", lastmod: articles.at(-1)?.publishedAt ?? "2026-09-30", changefreq: "daily" },
          ...LANDINGS.map((page) => ({ path: `/${page.slug}`, priority: "0.8", lastmod: "2026-09-30", changefreq: "weekly" })),
          ...articles.map((article) => ({
            path: `/blog/${article.slug}`,
            priority: "0.8",
            lastmod: article.publishedAt > "2026-09-30" ? "2026-09-30" : article.publishedAt,
            changefreq: "monthly",
          })),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) =>
      `  <url><loc>${origin}${page.path}</loc><lastmod>${page.lastmod}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
