import { useEffect, useState } from "react";
import {
  Activity,
  Clock3,
  Compass,
  EyeOff,
  Lock,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { CHECKS, FAQ, STEPS } from "@/lib/check-love/content";
import { validateQuery } from "@/lib/check-love/lead";
import { visibleReviews } from "@/lib/check-love/review-schedule";
import type { QueryType, ViewName } from "@/lib/check-love/types";

const ICONS = {
  vk: Users,
  social: Share2,
  tg: MessageCircle,
  dating: Compass,
  numbers: Phone,
  geo: MapPin,
  shops: ShoppingBag,
  night: Moon,
  risk: Activity,
} as const;

export function HomeView({
  query,
  queryType,
  error,
  reportId,
  resumeView,
  onQuery,
  onType,
  onSubmit,
  onResume,
  onLegal,
  headline,
  lead,
  notes,
  related,
}: {
  query: string;
  queryType: QueryType;
  error: string;
  reportId: string | null;
  resumeView: ViewName | null;
  onQuery: (value: string) => void;
  onType: (value: QueryType) => void;
  onSubmit: () => void;
  onResume: () => void;
  onLegal: (doc: "policy" | "offer" | "disclaimer") => void;
  headline?: string;
  lead?: string;
  notes?: { intro: string; points: string[] };
  related?: Array<{ slug: string; title: string }>;
}) {
  const [dock, setDock] = useState(false);
  useEffect(() => {
    const node = document.getElementById("check-form");
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setDock(!entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const ready = validateQuery(queryType, query) === null;

  return (
    <>
      <div className="wrap narrow">
        {reportId && resumeView ? (
          <div className="resume">
            <p>
              {resumeView === "scan"
                ? `Проверка ${reportId} уже создана. Время скана идёт само — можно вернуться, пропуск не нужен.`
                : `Отчёт ${reportId} собран. Можно вернуться к результату.`}
            </p>
            <button type="button" className="btn-ghost btn-small" onClick={onResume}>
              Продолжить
            </button>
          </div>
        ) : null}

        <section className="hero">
          {headline ? (
            <nav className="crumb" aria-label="Хлебные крошки">
              <a href="/">Главная</a>
              <span aria-hidden="true"> / </span>
              <span>{headline}</span>
            </nav>
          ) : null}
          <p className="badge">онлайн · анонимно · без доступа к телефону</p>
          <h1>{headline ?? "Узнай правду за 2 минуты. Анонимно. Без доступа к телефону."}</h1>
          <p className="lede">
            {lead ??
              "Введите номер или страницу VK. За две минуты соберём отчёт по открытым источникам. Партнёр не получит ни уведомления, ни запроса."}
          </p>
          <ul className="pills">
            <li>
              <EyeOff size={15} aria-hidden="true" /> Анонимная проверка
            </li>
            <li>
              <ShieldCheck size={15} aria-hidden="true" /> Только открытые источники
            </li>
            <li>
              <Clock3 size={15} aria-hidden="true" /> Быстрый и точный результат
            </li>
          </ul>
        </section>

        <form
          id="check-form"
          className={error ? "frame is-error" : ready ? "frame is-valid" : "frame"}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="frame-top">
            <p>Заявка на отчёт</p>
            <span className="online">
              <i /> без уведомления
            </span>
          </div>
          <div className="tabs" role="tablist" aria-label="Что проверить">
            <button
              type="button"
              role="tab"
              id="tab-phone"
              aria-selected={queryType === "phone"}
              aria-pressed={queryType === "phone"}
              onClick={() => onType("phone")}
            >
              Номер телефона
            </button>
            <button
              type="button"
              role="tab"
              id="tab-vk"
              aria-selected={queryType === "vk"}
              aria-pressed={queryType === "vk"}
              onClick={() => onType("vk")}
            >
              Ссылка VK
            </button>
          </div>
          <label className="sr-only" htmlFor="query-input">
            {queryType === "phone" ? "Номер телефона" : "Страница ВКонтакте"}
          </label>
          <input
            id="query-input"
            value={query}
            maxLength={180}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode={queryType === "phone" ? "tel" : "text"}
            placeholder={queryType === "phone" ? "+7 900 000-00-00" : "vk.com/username или @имя"}
            aria-invalid={error ? true : undefined}
            aria-describedby="form-help"
            onChange={(event) => onQuery(event.target.value)}
          />
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <p id="form-help" className="micro">
            Пароль и SMS не нужны. Партнёр не получит уведомление.
          </p>
          <button type="submit" className="btn-cta btn-hero pulse">
            Начать проверку
          </button>
        </form>

        <dl className="stats stats-offer">
          <div>
            <dt>3 500+ проверок</dt>
          </div>
          <div>
            <dt>Оценка Яндекса 4.9 из 5</dt>
          </div>
          <div>
            <dt>Структурированный отчёт</dt>
          </div>
          <div>
            <dt>Без взлома — только открытые данные</dt>
          </div>
        </dl>
      </div>

      {notes ? (
        <section className="wrap narrow seo-note" aria-labelledby="seo-note-title">
          <h2 id="seo-note-title">Что даёт эта проверка</h2>
          <p>{notes.intro}</p>
          <ul>
            {notes.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="wrap">
        <blockquote className="pull">
          <p>Тревога — ещё не обвинение.</p>
          <footer>
            Закрытый телефон, тишина после командировки, вахта, расстояние — повод посмотреть факты, а не устраивать сцену.
            Если в открытых источниках пусто, вы это увидите. Пустота тоже ответ.
          </footer>
        </blockquote>

        <section className="section" aria-labelledby="checks-title">
          <p className="kicker">01 — Контур</p>
          <h2 id="checks-title">Что проверяем</h2>
          <p className="section-lead">
            Семь рабочих модулей и два пояснения к ним. Ни одного входа в телефон, пароль или личную переписку.
          </p>
          <div className="card-grid">
            {CHECKS.map((item) => {
              const Icon = ICONS[item.id as keyof typeof ICONS];
              return (
                <article key={item.id} className={item.note ? "card card-late" : "card"}>
                  <span className="card-icon">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.note ? <span className="badge">{item.note}</span> : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="section" aria-labelledby="how-title">
          <p className="kicker">02 — Порядок</p>
          <h2 id="how-title">Как это работает</h2>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" aria-labelledby="faq-title">
          <p className="kicker">03 — Прямые ответы</p>
          <h2 id="faq-title">Вопросы</h2>
          <div className="faq">
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>
                  {item.q}
                  <span className="faq-plus" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="reviews-title">
          <p className="kicker">04 — Отзывы</p>
          <h2 id="reviews-title">Отзывы о проверке</h2>
          <p className="section-lead">Имена изменены. Это то, что человек увидел в отчёте по открытым данным.</p>
          <div className="review-grid">
            {visibleReviews().map((review) => (
              <figure key={review.id} className="review">
                <figcaption>
                  <strong>
                    {review.name}, {review.city}
                  </strong>
                </figcaption>
                <blockquote>{review.text}</blockquote>
              </figure>
            ))}
          </div>
          <a className="btn-ghost" href="/reviews">
            Все отзывы
          </a>
        </section>

        <section className="final">
          <Lock size={20} aria-hidden="true" />
          <h2>Готовы узнать правду?</h2>
          <p>Две минуты — и отчёт собран. Партнёр не узнает.</p>
          <button
            type="button"
            className="btn-cta pulse"
            onClick={() => document.getElementById("check-form")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            Начать проверку
          </button>
        </section>

        {related && related.length > 0 ? (
          <nav className="related-landings" aria-label="Похожие проверки">
            <h2>Похожие проверки</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <a href={`/${item.slug}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <footer className="footer">
          <div>
            <p className="logo-word">Check-Love</p>
            <p>Дистанционная аналитика открытых источников. Не читаем переписки. Не просим пароль. Не входим в телефон.</p>
            <p className="micro">
              Поддержка 24/7:{" "}
              <a href="https://t.me/ChekLoveService" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </p>
          </div>
          <nav aria-label="Разделы сайта">
            <a href="/reviews">Отзывы</a>
            <a href="/examples">Примеры проверок</a>
            <a href="/blog">Блог</a>
            <button type="button" onClick={() => onLegal("policy")}>
              Политика
            </button>
            <button type="button" onClick={() => onLegal("offer")}>
              Оферта
            </button>
            <button type="button" onClick={() => onLegal("disclaimer")}>
              Дисклеймер
            </button>
          </nav>
          <p className="legal-note">
            Instagram* принадлежит компании, признанной экстремистской на территории РФ, и указан только как публичная площадка цифрового следа.
          </p>
        </footer>
      </div>

      {dock ? (
        <div className="dock">
          <button
            type="button"
            className="btn-cta pulse"
            onClick={() => document.getElementById("check-form")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            Начать проверку
          </button>
        </div>
      ) : null}
    </>
  );
}
