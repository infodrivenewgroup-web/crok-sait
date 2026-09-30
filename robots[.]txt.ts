import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = `User-agent: *
Allow: /

User-agent: Yandex
Allow: /
Allow: /reviews
Allow: /examples
Allow: /blog

User-agent: YandexBot
Allow: /

Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&utm_referrer&yclid&ysclid&ymclid&gclid&fbclid&etext&_openstat&from

Sitemap: ${origin}/sitemap.xml
`;
        return new Response(body, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
