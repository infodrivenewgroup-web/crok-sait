import { notFound } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";

export const NOT_FOUND_TITLE = "Страница не найдена — Check-Love";
export const NOT_FOUND_DESCRIPTION = "Такой страницы нет. Вернитесь на главную или откройте блог Check-Love.";

export function missingPage(): never {
  throw notFound({
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export function NotFoundPage() {
  return (
    <div className="app-root">
      <SiteHeader onLogo={() => window.location.assign("/")} />
      <main className="wrap narrow blog-page">
        <p className="kicker">404</p>
        <h1>Страница не найдена</h1>
        <p className="lede">{NOT_FOUND_DESCRIPTION}</p>
        <p className="article-actions">
          <a className="btn-cta" href="/">
            На главную
          </a>
          <a className="btn-ghost" href="/blog">
            Открыть блог
          </a>
        </p>
      </main>
    </div>
  );
}
