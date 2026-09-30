import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Check,
  Eye,
  FileText,
  GitCompare,
  Globe,
  Hash,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  ScanSearch,
  Send,
  Share2,
  Shield,
  ThumbsUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { pickRunFacts, type Fact } from "@/lib/check-love/seed";
import {
  browserClock,
  buildScanLog,
  COMPLETE_MS,
  SCAN_MS,
  SERVICES,
  STAGES,
  serviceState,
  stageIndexAt,
  stageProgress,
  type StageIcon,
} from "@/lib/check-love/scan";
import type { QueryType } from "@/lib/check-love/types";

const ICONS: Record<StageIcon, LucideIcon> = {
  shield: Shield,
  scan: ScanSearch,
  users: Users,
  share: Share2,
  eye: Eye,
  send: Send,
  phone: Phone,
  globe: Globe,
  heart: Heart,
  archive: Archive,
  thumbs: ThumbsUp,
  messages: MessageCircle,
  moon: Moon,
  map: MapPin,
  hash: Hash,
  git: GitCompare,
  file: FileText,
};

export function ScanView({
  query,
  queryType,
  startedAt,
  onDone,
}: {
  query: string;
  queryType: QueryType;
  startedAt: number;
  onDone: () => void;
}) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finished = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => Date.now());
  const factsRef = useRef<Fact[] | null>(null);
  const logLinesRef = useRef<ReturnType<typeof buildScanLog> | null>(null);
  if (!factsRef.current) factsRef.current = pickRunFacts(startedAt);
  if (!logLinesRef.current) logLinesRef.current = buildScanLog(startedAt);
  const factsAll = factsRef.current;
  const logLines = logLinesRef.current;

  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (!finished.current && t - startedAt >= SCAN_MS + COMPLETE_MS) {
        finished.current = true;
        onDoneRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const elapsed = Math.max(0, now - startedAt);
  const scanning = elapsed < SCAN_MS;
  const pct = Math.min(100, Math.round((Math.min(elapsed, SCAN_MS) / SCAN_MS) * 100));
  const stageIndex = stageIndexAt(Math.min(elapsed, SCAN_MS - 1));
  const stage = STAGES[stageIndex];
  const Icon = ICONS[stage.icon];
  const local = scanning ? stageProgress(elapsed) : 1;
  const visibleLogs = logLines.filter((line) => line.at <= elapsed).slice(-50);
  const facts = factsAll.filter((fact) => fact.at <= elapsed);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [visibleLogs.length]);

  return (
    <div className="wrap scan-board">
      <p className="kicker">Анализ открытых данных</p>
      <h1>Поиск и анализ информации по {queryType === "phone" ? "номеру" : "профилю"}</h1>
      <p className="query-hot">{query}</p>

      {scanning ? (
        <>
          <div className="prog-head">
            <p className="prog-pct">{pct}%</p>
            <p className="micro">общий ход проверки</p>
          </div>
          <div
            className="prog-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Ход проверки"
          >
            <span style={{ width: `${pct}%` }} />
          </div>

          <section className="scan-block" aria-label="Анализ данных. Пожалуйста, не закрывайте страницу.">
            <h2>Анализ данных… Пожалуйста, не закрывайте страницу.</h2>
            <ul className="service-grid">
              {SERVICES.map((service) => {
                const state = serviceState(service.id, elapsed);
                return (
                  <li key={service.id} className={`service-tile is-${state}`}>
                    <span>{service.name}</span>
                    {state === "done" ? <Check size={16} aria-hidden="true" /> : null}
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="scan-split">
            <section className="process-card" aria-live="polite">
              <p className="kicker">Текущий процесс</p>
              <div className="process-title">
                <span className="card-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h2>{stage.title}</h2>
              </div>
              <p>{stage.text}</p>
              <div className="mini-bar" aria-hidden="true">
                <span style={{ width: `${Math.round(local * 100)}%` }} />
              </div>
              <p className="micro">Этап {stageIndex + 1} из {STAGES.length}</p>
            </section>

            <section className="console-card" aria-label="Журнал проверки">
              <p className="kicker">Журнал</p>
              <div className="console" ref={logRef}>
                {visibleLogs.map((line) => {
                  const mark = "Информация найдена";
                  const at = line.text.indexOf(mark);
                  return (
                    <p key={line.at}>
                      <time>[{browserClock(startedAt + line.at)}]</time>{" "}
                      {at === -1 ? (
                        line.text
                      ) : (
                        <>
                          {line.text.slice(0, at)}
                          <strong className="log-report">{mark}</strong>
                        </>
                      )}
                    </p>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="found-card" aria-label="Подозрительные сигналы">
            <h2>Подозрительные сигналы</h2>
            {facts.length === 0 ? (
              <p className="micro">Сигналы появятся в момент проверки соответствующего источника. Суть не раскрываем.</p>
            ) : (
              <ul className="found-list">
                {facts.map((fact) => (
                  <FactRow key={fact.id} fact={fact} />
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <div className="complete-card" role="status">
          <span className="lock-ping">
            <Lock size={28} aria-hidden="true" />
          </span>
          <h2>ПРОВЕРКА ЗАВЕРШЕНА!</h2>
          <p>Формирование отчёта…</p>
        </div>
      )}
      <p className="scan-foot">Партнёр не получает уведомление · переписки не читаем · в телефон не входим</p>
    </div>
  );
}

function FactRow({ fact }: { fact: Fact }) {
  return (
    <li className="found-item">
      <strong>{fact.title}</strong>
      <span>сигнал</span>
    </li>
  );
}
