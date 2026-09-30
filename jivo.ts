/** Вставьте ID виджета Jivo. Пока стоит заглушка, чат не грузится: на экране менеджера заявка копируется. */
export const JIVO_WIDGET_ID = "PASTE_JIVO_ID_HERE";

export function isJivoConfigured(id: string = JIVO_WIDGET_ID): boolean {
  const clean = id.trim();
  return clean.length > 0 && !clean.includes("PASTE") && !clean.includes("HERE");
}

declare global {
  interface Window {
    jivo_api?: {
      open: () => void;
      setContactInfo?: (info: {
        name?: string;
        email?: string;
        phone?: string;
        description?: string;
      }) => void;
      setCustomData?: (data: Array<{ title: string; content: string }>) => void;
    };
    jivo_onLoadCallback?: () => void;
  }
}

let loader: Promise<void> | null = null;
let armed = false;

export function loadJivo(): Promise<void> {
  if (!isJivoConfigured() || typeof document === "undefined") return Promise.resolve();
  if (loader) return loader;
  loader = new Promise((resolve) => {
    if (document.querySelector("script[data-checklove-jivo]")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://code.jivosite.com/widget/${JIVO_WIDGET_ID}`;
    script.async = true;
    script.dataset.checkloveJivo = "1";
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
  return loader;
}

export function armJivo(): void {
  if (armed || !isJivoConfigured() || typeof window === "undefined") return;
  armed = true;
  const start = () => {
    void loadJivo();
  };
  const idle = window.setTimeout(start, 4500);
  const onIntent = () => {
    window.clearTimeout(idle);
    start();
  };
  window.addEventListener("pointerdown", onIntent, { once: true, passive: true });
  window.addEventListener("keydown", onIntent, { once: true });
}

function waitForApi(ms: number): Promise<boolean> {
  if (window.jivo_api) return Promise.resolve(true);
  return new Promise((resolve) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.jivo_api) {
        window.clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - started > ms) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 120);
  });
}

export async function openJivoChat(payload: {
  text: string;
  reportId: string;
  query: string;
  queryType: "phone" | "vk";
  tariffLabel: string;
  index: number;
}): Promise<"opened" | "fallback"> {
  if (!isJivoConfigured()) return "fallback";
  await loadJivo();
  const ready = await waitForApi(5000);
  if (!ready || !window.jivo_api) return "fallback";
  window.jivo_api.setContactInfo?.({
    name: "Клиент Check-Love",
    phone: payload.queryType === "phone" ? payload.query : "",
    description: payload.text,
  });
  window.jivo_api.setCustomData?.([
    { title: "Номер отчёта", content: payload.reportId },
    { title: "Запрос", content: payload.query },
    { title: "Тариф", content: payload.tariffLabel },
    { title: "Индекс", content: `${payload.index}%` },
  ]);
  window.jivo_api.open();
  return "opened";
}
