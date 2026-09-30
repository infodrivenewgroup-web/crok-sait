import { Check } from "lucide-react";
import { TARIFF_DISCLAIMER, TARIFFS } from "@/lib/check-love/content";
import type { TariffId } from "@/lib/check-love/types";

export function TariffCards({
  mode,
  preferred,
  onPick,
}: {
  mode: "remember" | "choose";
  preferred: TariffId | null;
  onPick: (id: TariffId) => void;
}) {
  return (
    <div className="tariff-wrap">
      <div className="tariff-grid">
        {TARIFFS.map((plan) => {
          const marked = preferred === plan.id;
          return (
            <article key={plan.id} className={plan.id === "full" ? "tariff tariff-full" : "tariff"}>
              {plan.badge ? <span className="tariff-badge">{plan.badge}</span> : null}
              <p className="tariff-name">{plan.name}</p>
              <p className="tariff-price">
                <strong>{plan.priceLabel}</strong>
                {plan.oldPriceLabel ? <s>{plan.oldPriceLabel}</s> : null}
              </p>
              {plan.coupon ? <p className="tariff-coupon">{plan.coupon}</p> : null}
              <ul className="tariff-list">
                {plan.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-cta"
                onClick={() => onPick(plan.id)}
              >
                {marked && mode === "choose" ? "Выбрано" : plan.cta}
                <span aria-hidden="true"> →</span>
              </button>
              <p className="tariff-foot">{plan.foot}</p>
            </article>
          );
        })}
      </div>
      <p className="disclaimer">{TARIFF_DISCLAIMER}</p>
    </div>
  );
}
