import { useState } from "react";
import { ChevronLeft, Copy } from "lucide-react";
import { LEGAL } from "@/lib/check-love/content";
import { isJivoConfigured } from "@/lib/check-love/jivo";
import { leadText, tariffLine, tariffPrice } from "@/lib/check-love/lead";
import type { LegalDoc, QueryType, TariffId } from "@/lib/check-love/types";
import { TariffCards } from "../TariffCards";

export function TariffsView({
  reportId,
  preferred,
  onChoose,
  onBack,
}: {
  reportId: string;
  preferred: TariffId | null;
  onChoose: (id: TariffId) => void;
  onBack: () => void;
}) {
  return (
    <div className="wrap funnel">
      <button type="button" className="text-back" onClick={onBack}>
        <ChevronLeft size={16} aria-hidden="true" /> К закрытому результату
      </button>
      <p className="kicker mono">{reportId}</p>
      <h1>Одна проверка — полный отчёт</h1>
      <p className="lede">
        Базовая — 1999 ₽, полная — 2999 ₽. Цена фиксированная, купон −500 ₽ уже применён. Счёт выставит оператор после выбора.
      </p>
      <TariffCards mode="choose" preferred={preferred} onPick={onChoose} />
    </div>
  );
}

export function ManagerView({
  reportId,
  query,
  queryType,
  index,
  tariff,
  onChangeTariff,
  onOpenChat,
}: {
  reportId: string;
  query: string;
  queryType: QueryType;
  index: number;
  tariff: TariffId;
  onChangeTariff: () => void;
  onOpenChat: () => Promise<"opened" | "fallback">;
}) {
  const [fallback, setFallback] = useState(!isJivoConfigured());
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);
  const text = leadText({ reportId, query, queryType, index, tariff });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="wrap narrow funnel">
      <p className="badge">персональный менеджер · счёт в чате</p>
      <h1>Вам назначен персональный менеджер</h1>
      <p className="lede">
        Он найдёт отчёт по этому номеру, откроет закрытые блоки выбранного тарифа и отправит результат после оплаты. На сайте деньги не списываются. Счёт придёт в чат.
      </p>

      <div className="manager-card">
        <p className="kicker">Номер отчёта</p>
        <p className="report-xl">{reportId}</p>
        <dl>
          <div>
            <dt>Запрос</dt>
            <dd>{query}</dd>
          </div>
          <div>
            <dt>Тип</dt>
            <dd>{queryType === "phone" ? "Телефон" : "VK"}</dd>
          </div>
          <div>
            <dt>Тариф</dt>
            <dd>
              {tariff === "express" ? "Базовая" : "Полная"} · {tariffPrice(tariff)}
            </dd>
          </div>
          <div>
            <dt>Риск</dt>
            <dd>{index}%</dd>
          </div>
        </dl>
        <button type="button" className="text-back" onClick={onChangeTariff}>
          Изменить тариф
        </button>
      </div>

      <ol className="manager-steps">
        <li>
          <span>1</span>
          Нажать «Открыть чат с оператором»
        </li>
        <li>
          <span>2</span>
          Назвать номер отчёта — он уже прикреплён
        </li>
        <li>
          <span>3</span>
          Менеджер подтвердит тариф {tariffLine(tariff)} и выставит счёт
        </li>
        <li>
          <span>4</span>
          После оплаты отчёт придёт в этот чат или на почту за 1–2 часа
        </li>
      </ol>

      {!fallback ? (
        <button
          type="button"
          className="btn-cta pulse"
          disabled={pending}
          onClick={() => {
            setPending(true);
            void onOpenChat().then((result) => {
              setPending(false);
              if (result === "fallback") setFallback(true);
            });
          }}
        >
          {pending ? "Открываем чат…" : "Открыть чат с оператором"}
        </button>
      ) : (
        <div className="copy-box">
          <p className="micro">
            {isJivoConfigured()
              ? "Чат сейчас не ответил. Скопируйте заявку — в ней уже есть номер отчёта, запрос и тариф."
              : "Онлайн-чат ещё не подключён. Скопируйте заявку и отправьте её оператору: номер отчёта уже внутри."}
          </p>
          <textarea readOnly value={text} aria-label="Текст заявки" />
          <button type="button" className="btn-cta" onClick={() => void copy()}>
            <Copy size={16} aria-hidden="true" />
            {copied ? "Скопировано" : "Скопировать"}
          </button>
        </div>
      )}
    </div>
  );
}

export function LegalView({ doc, onBack }: { doc: LegalDoc; onBack: () => void }) {
  const page = LEGAL[doc];
  return (
    <div className="wrap narrow funnel">
      <button type="button" className="text-back" onClick={onBack}>
        <ChevronLeft size={16} aria-hidden="true" /> Назад
      </button>
      <p className="kicker">Документ · редакция 29 сентября 2026</p>
      <h1>{page.title}</h1>
      {page.paragraphs.map((paragraph) => (
        <p key={paragraph} className="legal-p">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
