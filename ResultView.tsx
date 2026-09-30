import { useEffect, useState } from "react";
import { Eye, EyeOff, Heart, History, Layers, Lock, MapPin, MessageCircle, Phone, ShieldCheck, Smartphone, ThumbsUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EXAMPLES } from "@/lib/check-love/content";
import { reachGoal, withDirect } from "@/lib/check-love/direct";
import { formatClock } from "@/lib/check-love/scan";
import type { QueryType } from "@/lib/check-love/types";

const PAY_URL = "https://love-courses.bolt.host/#/pay-express-9f3k7q2m";
const SUPPORT_URL = "https://t.me/ChekLoveService";

const ICONS: Record<string, LucideIcon> = {
  "vk-friends": Users,
  history: History,
  joint: Eye,
  dating: Heart,
  groups: Layers,
  likes: ThumbsUp,
  geo: MapPin,
  "tg-chats": MessageCircle,
  "tg-joint": Users,
  phones: Phone,
};

export function ResultView({
  reportId,
  query,
  queryType,
  offerEndsAt,
}: {
  reportId: string;
  query: string;
  queryType: QueryType;
  index: number;
  offerEndsAt: number;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  const left = Math.max(0, offerEndsAt - now);

  return (
    <div className="wrap narrow funnel result-page">
      <div className="result-hero">
        <span className="lock-ping" aria-hidden="true">
          <Lock size={28} />
        </span>
        <p className="result-found-kicker">Информация найдена по всем разделам отчёта</p>
        <h1>Проверка завершена успешно!</h1>
        <p className="lede">Ваш персональный отчёт сформирован и готов к отправке. Мы гарантируем достоверность и полную конфиденциальность.</p>
        <p className="result-query">
          <span>{queryType === "phone" ? "Проверка проводилась по номеру" : "Проверка проводилась по профилю"}</span>
          <strong className="query-hot">{query}</strong>
        </p>
        <p className="report-id">{reportId}</p>
      </div>

      <section className="found-report" aria-labelledby="found-title">
        <div className="found-report-head">
          <h2 id="found-title">Отчёт с результатом проверки содержит:</h2>
          <p className="report-ready">Отчёт успешно структурирован по всем указанным разделам и доступен сразу после оплаты.</p>
        </div>
        <ul>
          {EXAMPLES.map((item) => {
            const Icon = ICONS[item.id] ?? Users;
            return (
              <li key={item.id}>
                <span className="found-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
                <em>
                  <Lock size={14} aria-hidden="true" />
                  Найдено
                </em>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="discount-call">Успей получить отчёт со скидкой 500 рублей!</p>

      <section className="price-board" aria-label="Стоимость расшифровки">
        <p className="price-kicker">Скидка на этот отчёт</p>
        <p className="price-now">
          1999 ₽ <s>2499 ₽</s>
        </p>
        <p className="price-off">−500 ₽ уже применено</p>
        <p className="offer-line">{left > 0 ? "Цена держится ещё" : "Время предложения вышло"}</p>
        <p className="offer-timer" role="timer" aria-live="polite">
          {left > 0 ? formatClock(left) : "00:00"}
        </p>
        <a
          className="btn-cta btn-pay pulse"
          href={withDirect(PAY_URL)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reachGoal("pay_sbp")}
        >
          <Smartphone size={20} aria-hidden="true" />
          Оплатить по СБП
        </a>
        <ul className="trust-row">
          <li>
            <EyeOff size={16} aria-hidden="true" /> Партнёр не узнает
          </li>
          <li>
            <ShieldCheck size={16} aria-hidden="true" /> Полная конфиденциальность
          </li>
          <li>
            <Lock size={16} aria-hidden="true" /> Отчёт доступен сразу после оплаты
          </li>
        </ul>
        <p className="support-note">
          Если возникнут сложности с оплатой или отчётом, напишите в круглосуточную поддержку в{" "}
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          .
        </p>
      </section>
    </div>
  );
}
