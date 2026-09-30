import { ChevronLeft, Check, Eye, Heart, History, Layers, MapPin, MessageCircle, Phone, ThumbsUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EXAMPLE_LOG, EXAMPLES } from "@/lib/check-love/content";

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

export function ExamplesView({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <div className="wrap funnel">
      <button type="button" className="text-back" onClick={onBack}>
        <ChevronLeft size={16} aria-hidden="true" /> На главную
      </button>
      <p className="kicker">Примеры проверок</p>
      <h1>Так выглядит готовый отчёт</h1>
      <p className="lede">
        Ниже — образец проверки по открытым данным. Имена, ссылки и адреса в примере не показаны. Пароль не нужен, переписки не читаются, партнёр не получает уведомление.
      </p>

      <section className="sample-session" aria-label="Образец проверки">
        <div>
          <p className="kicker">Проверка</p>
          <p className="mono">CL-184203</p>
        </div>
        <div>
          <p className="kicker">Запрос</p>
          <p>+7 9•• ••• •• 42</p>
        </div>
        <div>
          <p className="kicker">Статус</p>
          <p>Отчёт собран, подробности в разделах ниже</p>
        </div>
      </section>

      <section className="sample-log" aria-label="Ход проверки">
        <h2>Ход проверки</h2>
        <ol>
          {EXAMPLE_LOG.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="sample-report" aria-labelledby="sample-report-title">
        <h2 id="sample-report-title">Ваш отчёт содержит:</h2>
        <div className="sample-grid">
          {EXAMPLES.map((item) => {
            const Icon = ICONS[item.id] ?? Users;
            return (
              <article key={item.id}>
                <span className="sample-icon" aria-hidden="true">
                  <Icon size={16} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
                <Check size={16} aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </section>

      <p className="micro center">10 разделов в каждом полном отчёте. В примере нет чужих имён — они открываются только после оплаты вашей проверки.</p>
      <button type="button" className="btn-cta" onClick={onStart}>
        Проверить свой запрос
      </button>
    </div>
  );
}
