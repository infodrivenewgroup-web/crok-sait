import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { NotFoundPage, NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE } from "@/components/check-love/NotFoundPage";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Check-Love — анонимная проверка по открытым данным";
const DESCRIPTION =
  "Анонимная проверка по номеру или странице VK. Только открытые данные: без взлома, без пароля и без уведомления партнёру. Отчёт доступен сразу после оплаты по СБП.";

function publicBannerHost(raw: string): string {
  const host = raw.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

async function xBannerUrl(): Promise<string> {
  const fromEnv = publicBannerHost(import.meta.env.VITE_PUBLIC_HOSTNAME ?? "");
  if (fromEnv) return `https://${fromEnv}/x-banner.jpg`;
  if (!import.meta.env.SSR) return "";
  try {
    const { getRequestUrl } = await import("@tanstack/start-server-core");
    const host = publicBannerHost(new URL(getRequestUrl()).host);
    return host ? `https://${host}/x-banner.jpg` : "";
  } catch {
    return "";
  }
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Check-Love",
  inLanguage: "ru-RU",
  description: DESCRIPTION,
}).replace(/</g, "\\u003c");

export const Route = createRootRoute({
  head: async ({ matches }) => {
    const missing = matches.some((item) => item.status === "notFound" || item._notFound);
    const title = missing ? NOT_FOUND_TITLE : APP_NAME;
    const description = missing ? NOT_FOUND_DESCRIPTION : DESCRIPTION;
    const robots = missing ? "noindex, nofollow" : "index, follow, max-image-preview:large";
    const xBanner = await xBannerUrl();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title },
        { name: "description", content: description },
        { name: "robots", content: robots },
        { name: "referrer", content: "strict-origin-when-cross-origin" },
        { name: "format-detection", content: "telephone=no" },
        { name: "theme-color", content: "#07060b" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ru_RU" },
        { property: "og:site_name", content: "Check-Love" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: "/og.jpg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: "/og.jpg" },
        ...(xBanner
          ? [
              { property: "x:game:image", content: xBanner },
              { property: "x:game:image:width", content: "1200" },
              { property: "x:game:image:height", content: "264" },
            ]
          : []),
      ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate icon", href: "/favicon.svg" },
      { rel: "mask-icon", href: "/favicon.svg", color: "#e11d48" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    };
  },
  notFoundComponent: NotFoundPage,
  component: () => (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body>
        <noscript>Для проверки включите JavaScript. Check-Love смотрит только открытые данные и не запрашивает пароль.</noscript>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
