import { useEffect, useRef, useState } from "react";
import { FileText, Lock } from "lucide-react";
import { COMPLETE_MS, FUNNEL_MS, GENERATE_MS, SCAN_MS } from "@/lib/check-love/scan";

const STEPS = [
  "Сверяем семнадцать этапов",
  "Закрываем имена, номера и адреса",
  "Считаем оценку риска по открытому следу",
  "Готовим отчёт к оплате",
];

export function GenerateView({ startedAt, onDone }: { startedAt: number; onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const done = useRef(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (!done.current && t - startedAt >= FUNNEL_MS) {
        done.current = true;
        onDoneRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const local = Math.min(1, Math.max(0, (now - startedAt - SCAN_MS - COMPLETE_MS) / GENERATE_MS));
  const shown = Math.max(1, Math.ceil(local * STEPS.length));

  return (
    <div className="wrap narrow funnel generate-card">
      <span className="card-icon">
        <FileText size={18} aria-hidden="true" />
      </span>
      <p className="kicker">Сборка отчёта</p>
      <h1>Формируем закрытый отчёт</h1>
      <p className="lede">Чувствительные поля прячем сразу. Открыть расшифровку можно будет после оплаты.</p>
      <div className="prog-bar" aria-hidden="true">
        <span style={{ width: `${Math.round(local * 100)}%` }} />
      </div>
      <ol className="generate-steps">
        {STEPS.slice(0, shown).map((step) => (
          <li key={step}>
            <Lock size={16} aria-hidden="true" />
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
