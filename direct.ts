const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_referrer", "yclid", "ysclid", "ymclid", "etext", "from"] as const;
const STORE = "cl-direct";

export type DirectMarks = Partial<Record<(typeof KEYS)[number], string>>;

function metrikaId(): number {
  const raw = import.meta.env.VITE_YANDEX_METRIKA_ID;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : 0;
}

export function captureDirect(): DirectMarks {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fresh: DirectMarks = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) fresh[key] = value.slice(0, 180);
  }
  let saved: DirectMarks = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(STORE) || "{}") as DirectMarks;
  } catch {
    saved = {};
  }
  const next = { ...saved, ...fresh };
  if (Object.keys(fresh).length > 0) sessionStorage.setItem(STORE, JSON.stringify(next));
  return next;
}

export function withDirect(url: string): string {
  if (typeof window === "undefined") return url;
  let saved: DirectMarks = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(STORE) || "{}") as DirectMarks;
  } catch {
    return url;
  }
  const entries = Object.entries(saved).filter((pair): pair is [string, string] => Boolean(pair[1]));
  if (!entries.length) return url;
  const target = new URL(url);
  for (const [key, value] of entries) target.searchParams.set(key, value);
  return target.toString();
}

export function installMetrika(): void {
  const id = metrikaId();
  if (!id || typeof window === "undefined" || document.getElementById("ym-cl")) return;
  const w = window as Window & { ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number } };
  w.ym =
    w.ym ||
    function ym(...args: unknown[]) {
      (w.ym!.a = w.ym!.a || []).push(args);
    };
  w.ym.l = Date.now();
  const script = document.createElement("script");
  script.id = "ym-cl";
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(script);
  w.ym(id, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: false,
  });
}

export function reachGoal(goal: string): void {
  const id = metrikaId();
  const ym = (window as Window & { ym?: (...args: unknown[]) => void }).ym;
  if (!id || typeof ym !== "function") return;
  ym(id, "reachGoal", goal);
}
