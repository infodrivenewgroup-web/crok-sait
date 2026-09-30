import { CreditCard, ShieldCheck } from "lucide-react";
import { tariffAmount, tariffPrice } from "@/lib/check-love/lead";
import type { PayMethod, QueryType, TariffId } from "@/lib/check-love/types";

export function PayView({
  method,
  reportId,
  query,
  queryType,
  tariff,
  onBack,
}: {
  method: PayMethod;
  reportId: string;
  query: string;
  queryType: QueryType;
  tariff: TariffId;
  onBack: () => void;
}) {
  const raw = import.meta.env.VITE_PAYMENT_URL as string | undefined;
  const gateway = raw?.trim() ? raw.trim() : "";
  const amount = tariffAmount(tariff);
  let payHref = "";
  if (gateway) {
    try {
      const url = new URL(gateway);
      url.searchParams.set("report", reportId);
      url.searchParams.set("query", query);
      url.searchParams.set("type", queryType);
      url.searchParams.set("method", method);
      url.searchParams.set("amount", amount);
      payHref = url.toString();
    } catch {
      payHref = "";
    }
  }

  return (
    <div className="wrap narrow funnel">
      <button type="button" className="text-back" onClick={onBack}>
        Назад к отчёту
      </button>
      <p className="badge">{method === "sbp" ? "Оплата по СБП" : "Оплата картой"}</p>
      <h1>{tariff === "express" ? "Оплата базовой проверки" : "Оплата полной проверки"}</h1>
      <p className="lede">
        Платёж открывает расшифровку отчёта {reportId}. Это анализ открытых данных: без взлома, без чтения переписок и без доступа к телефону.
      </p>

      <dl className="pay-grid">
        <div>
          <dt>Отчёт</dt>
          <dd className="mono">{reportId}</dd>
        </div>
        <div>
          <dt>{queryType === "phone" ? "Номер" : "Профиль"}</dt>
          <dd>{query}</dd>
        </div>
        <div>
          <dt>Сумма</dt>
          <dd>{tariffPrice(tariff)}</dd>
        </div>
        <div>
          <dt>Способ</dt>
          <dd>{method === "sbp" ? "СБП" : "Банковская карта"}</dd>
        </div>
      </dl>

      <p className="pay-safe">
        <ShieldCheck size={16} aria-hidden="true" />
        Партнёр не узнает о заявке. Чек и отчёт приходят только вам.
      </p>

      {payHref ? (
        <a className="btn-cta" href={payHref}>
          <CreditCard size={16} aria-hidden="true" />
          Перейти к оплате
        </a>
      ) : (
        <div className="copy-box">
          <p className="micro">
            Платёжный шлюз ещё не подключён. Укажите адрес формы в переменной VITE_PAYMENT_URL — мы передадим номер отчёта, запрос, способ и сумму.
          </p>
          <p className="mono pay-params">
            report={reportId}&type={queryType}&method={method}&amount={amount}
          </p>
        </div>
      )}
    </div>
  );
}
