import { FUNNEL_MS, SCAN_MS, COMPLETE_MS } from "./scan";
import type { LegalDoc, PayMethod, QueryType, Session, TariffId, ViewName } from "./types";

const KEY = "checklove.session.v1";

export const initialSession: Session = {
  view: "home",
  resumeView: null,
  returnView: "home",
  legal: null,
  queryType: "phone",
  query: "",
  reportId: null,
  index: null,
  tariff: null,
  preferred: null,
  payMethod: null,
  startedAt: null,
  offerEndsAt: null,
};

const VIEWS: ViewName[] = ["home", "scan", "generate", "result", "pay", "tariffs", "manager", "legal", "reviews", "examples"];

function isView(value: unknown): value is ViewName {
  return typeof value === "string" && VIEWS.includes(value as ViewName);
}

function isTariff(value: unknown): value is TariffId {
  return value === "express" || value === "full";
}

function isPay(value: unknown): value is PayMethod {
  return value === "sbp" || value === "card";
}

function isQuery(value: unknown): value is QueryType {
  return value === "phone" || value === "vk";
}

function isLegal(value: unknown): value is LegalDoc {
  return value === "policy" || value === "offer" || value === "disclaimer";
}

export function normalizeSession(session: Session, now = Date.now()): Session {
  const next: Session = { ...session };
  if (next.reportId && !/^CL-\d{6}$/.test(next.reportId)) next.reportId = null;
  if (next.index != null && (next.index < 61 || next.index > 95 || !Number.isFinite(next.index))) {
    next.index = null;
  }
  const funnel = next.view === "scan" || next.view === "generate" || next.view === "result" || next.view === "pay" || next.view === "tariffs" || next.view === "manager";
  if (funnel && (!next.reportId || next.index == null || next.startedAt == null)) {
    next.view = "home";
  }
  if (next.view === "manager" && !next.tariff) next.view = "tariffs";
  if (next.view === "pay" && !next.payMethod) next.view = "result";
  if ((next.view === "scan" || next.view === "generate") && next.startedAt != null) {
    const elapsed = now - next.startedAt;
    if (elapsed >= FUNNEL_MS) {
      next.view = "result";
      if (next.resumeView === "scan" || next.resumeView === "generate") next.resumeView = "result";
    } else if (elapsed >= SCAN_MS + COMPLETE_MS) {
      next.view = "generate";
    } else {
      next.view = "scan";
    }
  }
  const afterScan = next.view === "result" || next.view === "pay" || next.view === "tariffs" || next.view === "manager";
  if (afterScan && next.offerEndsAt == null) next.offerEndsAt = now + 15 * 60 * 1000;
  if (next.offerEndsAt != null && !Number.isFinite(next.offerEndsAt)) next.offerEndsAt = null;
  if (next.view === "legal" && !next.legal) next.view = next.returnView === "legal" ? "home" : next.returnView;
  if (!next.reportId) next.resumeView = null;
  return next;
}

export function resumeTarget(session: Session, now = Date.now()): ViewName {
  if (!session.reportId || session.startedAt == null || session.index == null) return "home";
  const elapsed = now - session.startedAt;
  if (elapsed < SCAN_MS + COMPLETE_MS) return "scan";
  if (elapsed < FUNNEL_MS) return "generate";
  const wanted = session.resumeView && session.resumeView !== "home" && session.resumeView !== "legal" && session.resumeView !== "scan" && session.resumeView !== "generate"
    ? session.resumeView
    : "result";
  if (wanted === "pay" && !session.payMethod) return "result";
  if (wanted === "manager" && !session.tariff) return "tariffs";
  return wanted;
}

export function loadSession(): Session | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const row = data as Record<string, unknown>;
    const session: Session = {
      ...initialSession,
      view: isView(row.view) ? row.view : "home",
      resumeView: isView(row.resumeView) ? row.resumeView : null,
      returnView: isView(row.returnView) ? row.returnView : "home",
      legal: isLegal(row.legal) ? row.legal : null,
      queryType: isQuery(row.queryType) ? row.queryType : "phone",
      query: typeof row.query === "string" ? row.query.slice(0, 180) : "",
      reportId: typeof row.reportId === "string" ? row.reportId : null,
      index: typeof row.index === "number" ? row.index : null,
      tariff: isTariff(row.tariff) ? row.tariff : null,
      preferred: isTariff(row.preferred) ? row.preferred : null,
      payMethod: isPay(row.payMethod) ? row.payMethod : null,
      startedAt: typeof row.startedAt === "number" ? row.startedAt : null,
      offerEndsAt: typeof row.offerEndsAt === "number" ? row.offerEndsAt : null,
    };
    return normalizeSession(session);
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}
