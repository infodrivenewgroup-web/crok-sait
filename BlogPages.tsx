import { SiteHeader } from "./SiteHeader";
import { fullSections } from "@/lib/check-love/article-body";
import { publishedArticles, relatedArticles, type Article } from "@/lib/check-love/articles";

function formatRuDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const index = Number(month) - 1;
  if (!year || !day || index < 0 || index > 11) return iso;
  return `${Number(day)} ${months[index]} ${year}`;
}

function go(path: string) {
  window.location.assign(path);
}

function BlogHeader({ blogCurrent = false }: { blogCurrent?: boolean }) {
  return (
    <SiteHeader
      blogCurrent={blogCurrent}
      onLogo={() => go("/")}
    />
  );
}

export function BlogIndex() {
  const articles = publishedArticles();
  return (
    <div className="app-root">
      <BlogHeader blogCurrent />
      <main className="wrap blog-page">
        <nav className="crumb" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true"> / </span>
          <span>Блог</span>
        </nav>
        <p className="kicker">Блог Check-Love</p>
        <h1>Проверка на верность по открытым данным</h1>
        <p className="lede">
          Понятные разборы: что можно узнать по открытым данным, где проходит граница и как говорить о результате без ссоры.
        </p>
        <div className="blog-grid">
          {articles.map((article) => (
            <a key={article.slug} className="blog-card" href={`/blog/${article.slug}`}>
              <time dateTime={article.publishedAt}>{formatRuDate(article.publishedAt)}</time>
              <strong>{article.title}</strong>
              <span>{article.description}</span>
              <em>Читать статью</em>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

export function BlogArticle({ article }: { article: Article }) {
  const list = publishedArticles();
  const index = list.findIndex((item) => item.slug === article.slug);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
  const related = relatedArticles(article.slug);
  const sections = fullSections(article);
  return (
    <div className="app-root">
      <BlogHeader />
      <main className="wrap narrow blog-page">
        <nav className="crumb" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true"> / </span>
          <a href="/blog">Блог</a>
          <span aria-hidden="true"> / </span>
          <span>{article.title}</span>
        </nav>
        <article className="article-body">
          <p className="kicker">Открытые данные</p>
          <h1>{article.title}</h1>
          <time dateTime={article.publishedAt}>{formatRuDate(article.publishedAt)}</time>
          <p className="lede">{article.lead}</p>
          <p className="article-deck">{article.description}</p>
          <nav className="article-toc" aria-label="Содержание">
            <strong>Содержание</strong>
            <ol>
              {sections.map((section, index) => (
                <li key={section.heading}>
                  <a href={`#razdel-${index}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          {sections.map((section, index) => (
            <section key={section.heading} id={`razdel-${index}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <p className="blog-cta-copy">
            Если нужен не общий разбор, а отчёт по конкретному номеру или странице, начните проверку. Партнёр не получит уведомление.
          </p>
          <a className="btn-cta" href="/">
            Начать проверку
          </a>
        </article>
        <nav className="article-pager" aria-label="Другие материалы">
          {prev ? <a href={`/blog/${prev.slug}`}>← {prev.title}</a> : <span />}
          <a href="/blog">Все статьи</a>
          {next ? <a href={`/blog/${next.slug}`}>{next.title} →</a> : <span />}
        </nav>
        {related.length > 0 ? (
          <nav className="related-landings" aria-label="Похожие статьи">
            <h2>Похожие статьи</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <a href={`/blog/${item.slug}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </main>
    </div>
  );
}

export function articleTitleTag(title: string): string {
  if (title.includes("Check-Love")) return title;
  const withBrand = `${title} | Check-Love`;
  return withBrand.length <= 70 ? withBrand : title;
}

export function articleJsonLd(article: Article, origin: string) {
  const url = `${origin}/blog/${article.slug}`;
  const sections = fullSections(article);
  const words = [article.lead, article.description, ...sections.flatMap((section) => [section.heading, ...section.paragraphs])]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        inLanguage: "ru-RU",
        keywords: article.keyword,
        wordCount: words,
        articleSection: "Проверка по открытым данным",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@type": "Blog", "@id": `${origin}/blog#blog`, name: "Блог Check-Love", url: `${origin}/blog` },
        author: { "@type": "Organization", name: "Check-Love", url: `${origin}/` },
        publisher: { "@type": "Organization", name: "Check-Love", url: `${origin}/` },
        image: { "@type": "ImageObject", url: `${origin}/og.jpg`, width: 1200, height: 630 },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Блог", item: `${origin}/blog` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  }).replace(/</g, "\\u003c");
}

export function blogIndexJsonLd(articles: Article[], origin: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${origin}/blog#blog`,
        name: "Блог Check-Love",
        description: "Статьи о проверке на верность по открытым данным: соцсети, номер, ВКонтакте и Telegram.",
        url: `${origin}/blog`,
        inLanguage: "ru-RU",
        publisher: { "@type": "Organization", name: "Check-Love", url: `${origin}/` },
        blogPost: articles.map((article) => ({
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          datePublished: article.publishedAt,
          url: `${origin}/blog/${article.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Блог", item: `${origin}/blog` },
        ],
      },
    ],
  }).replace(/</g, "\\u003c");
}
