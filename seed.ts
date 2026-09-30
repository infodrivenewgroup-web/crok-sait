import type { QueryType } from "./types";
import { SCAN_MS, STAGE_AT } from "./scan";

export interface Fact {
  id: string;
  title: string;
  detail: string;
  at: number;
}

export interface LogLine {
  at: number;
  clock: string;
  tag: string;
  text: string;
}

export interface CheckProfile {
  seed: number;
  reportId: string;
  index: number;
  facts: Fact[];
  logs: LogLine[];
}

const FACT_POOL: Array<{ id: string; title: string; stage: number }> = [
  { id: "friends", title: "Найдены скрытые друзья", stage: 1 },
  { id: "album", title: "Отмечен закрытый альбом", stage: 1 },
  { id: "deleted", title: "Обнаружен след удалённого профиля", stage: 1 },
  { id: "mirror", title: "Найдены похожие профили", stage: 2 },
  { id: "extra", title: "Обнаружен дополнительный аккаунт", stage: 2 },
  { id: "dating", title: "Есть совпадение на аккаунте или профиле знакомств", stage: 3 },
  { id: "likes", title: "Повторяются публичные реакции", stage: 4 },
  { id: "group", title: "Замечена активность в тематической группе", stage: 5 },
  { id: "privacy", title: "Часть площадок закрыта настройками", stage: 6 },
  { id: "night", title: "Отмечена ночная активность", stage: 7 },
  { id: "geo", title: "Есть повторяющиеся публичные места", stage: 8 },
  { id: "bind", title: "Найдена дополнительная привязка номера", stage: 10 },
];

export function hashSeed(type: QueryType, value: string): number {
  const input = `${type}:${value.trim().toLowerCase()}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRunFacts(runId: number): Fact[] {
  const rand = mulberry32((runId ^ 0x9e3779b9) >>> 0);
  const count = 3 + (rand() > 0.45 ? 1 : 0);
  const order = FACT_POOL.map((fact) => ({ fact, roll: rand() })).sort((a, b) => a.roll - b.roll);
  const facts = order.slice(0, count).map(({ fact }) => {
    const start = STAGE_AT[fact.stage] ?? 0;
    const end = STAGE_AT[fact.stage + 1] ?? SCAN_MS;
    const at = Math.floor(start + (end - start) * (0.35 + rand() * 0.4));
    return { id: `${fact.id}-${at}`, title: fact.title, detail: "", at };
  });
  facts.sort((a, b) => a.at - b.at);
  return facts;
}

export function buildProfile(type: QueryType, value: string): CheckProfile {
  const seed = hashSeed(type, value);
  const rand = mulberry32(seed);
  return {
    seed,
    reportId: `CL-${String(seed % 1_000_000).padStart(6, "0")}`,
    index: 74 + Math.floor(rand() * 18),
    facts: [],
    logs: [],
  };
}
