import { useEffect, useState } from "react";
import { SiteHeader } from "./SiteHeader";
import { captureDirect, installMetrika, reachGoal } from "@/lib/check-love/direct";
import { armJivo, openJivoChat } from "@/lib/check-love/jivo";
import { leadText, tariffLine, validateQuery } from "@/lib/check-love/lead";
import { buildProfile } from "@/lib/check-love/seed";
import { SCAN_BUILD } from "@/lib/check-love/scan";
import { initialSession, loadSession, resumeTarget, saveSession } from "@/lib/check-love/session";
import { landingNotes } from "@/lib/check-love/landing-seo";
import { syncLandingMeta, type LandingPage } from "@/lib/check-love/landings";
import type { LegalDoc, QueryType, Session } from "@/lib/check-love/types";
import { Atmosphere } from "./Atmosphere";
import { HomeView } from "./views/HomeView";
import { LegalView, ManagerView, TariffsView } from "./views/FunnelViews";
import { GenerateView } from "./views/GenerateView";
import { PayView } from "./views/PayView";
import { ResultView } from "./views/ResultView";
import { ReviewsView } from "./views/ReviewsView";
import { ExamplesView } from "./views/ExamplesView";
import { ScanView } from "./views/ScanView";

function scrollTopSoon() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function CheckLoveApp({
  landing,
}: {
  landing?: LandingPage & { related?: Array<{ slug: string; title: string }> };
}) {
  const [session, setSession] = useState<Session>(initialSession);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = loadSession();
    const requested = new URLSearchParams(window.location.search).get("view");
    if (requested === "reviews" || requested === "examples") {
      setSession({ ...(saved ?? initialSession), view: requested, legal: null });
    } else if (saved) {
      setSession(saved);
    }
    setHydrated(true);
    armJivo();
    captureDirect();
    installMetrika();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSession(session);
  }, [session, hydrated]);

  useEffect(() => {
    const titles: Record<Session["view"], string> = {
      home: "Анонимная проверка на верность. Анонимно, Без регистрации.",
      scan: session.reportId ? `Проверка · ${session.reportId}` : "Проверка · Check-Love",
      generate: "Формирование отчёта · Check-Love",
      result: "Отчёт готов · Check-Love",
      reviews: "Отзывы · Check-Love",
      examples: "Примеры проверок · Check-Love",
      pay: "Оплата · Check-Love",
      tariffs: "Тарифы · Check-Love",
      manager: "Менеджер · Check-Love",
      legal: "Документы · Check-Love",
    };
    document.title = landing && session.view === "home" ? landing.title : titles[session.view];
    if (landing) syncLandingMeta(landing, session.view === "home");
  }, [session.view, session.reportId, landing]);

  const patch = (partial: Partial<Session>) => setSession((prev) => ({ ...prev, ...partial }));

  const goHome = () => {
    patch({ view: "home", legal: null });
    scrollTopSoon();
  };

  const submit = () => {
    const message = validateQuery(session.queryType, session.query);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    reachGoal("start_check");
    const profile = buildProfile(session.queryType, session.query.trim());
    setSession((prev) => ({
      ...prev,
      query: prev.query.trim(),
      reportId: profile.reportId,
      index: profile.index,
      tariff: null,
      payMethod: null,
      preferred: prev.preferred,
      offerEndsAt: null,
      startedAt: Date.now(),
      view: "scan",
      resumeView: "scan",
      legal: null,
    }));
    scrollTopSoon();
  };

  const openLegal = (doc: LegalDoc) => {
    setSession((prev) => ({
      ...prev,
      legal: doc,
      returnView: prev.view === "legal" ? prev.returnView : prev.view,
      view: "legal",
    }));
    scrollTopSoon();
  };

  const showHeader = session.view !== "result";

  return (
    <div className="app-root">
      <Atmosphere rain={session.view === "home" || session.view === "scan" || session.view === "generate"} />
      {showHeader ? (
      <SiteHeader
        onLogo={goHome}
        reportId={session.view !== "home" && session.view !== "reviews" && session.view !== "examples" ? session.reportId : null}
        scanBadge={session.view !== "home" && session.view !== "reviews" && session.view !== "examples" ? SCAN_BUILD : null}
      />
      ) : null}

      <main>
        {session.view === "home" ? (
          <HomeView
            query={session.query}
            queryType={session.queryType}
            error={error}
            reportId={session.reportId}
            resumeView={session.resumeView}
            onQuery={(query) => {
              setError("");
              patch({ query });
            }}
            onType={(queryType: QueryType) => {
              setError("");
              patch({ queryType });
            }}
            onSubmit={submit}
            onResume={() => {
              patch({ view: resumeTarget(session) });
              scrollTopSoon();
            }}
            onLegal={openLegal}
            headline={landing?.title}
            lead={landing?.description}
            notes={landing ? landingNotes(landing) : undefined}
            related={landing?.related}
          />
        ) : null}

        {session.view === "scan" && session.startedAt != null ? (
          <ScanView
            query={session.query}
            queryType={session.queryType}
            startedAt={session.startedAt}
            onDone={() => {
              patch({ view: "generate", resumeView: "generate" });
              scrollTopSoon();
            }}
          />
        ) : null}

        {session.view === "generate" && session.startedAt != null ? (
          <GenerateView
            startedAt={session.startedAt}
            onDone={() => {
              setSession((prev) => ({
                ...prev,
                view: "result",
                resumeView: "result",
                preferred: prev.preferred ?? "full",
                offerEndsAt: Date.now() + 15 * 60 * 1000,
              }));
              scrollTopSoon();
            }}
          />
        ) : null}

        {session.view === "reviews" ? (
          <ReviewsView
            onBack={goHome}
            onStart={() => {
              goHome();
              window.setTimeout(() => document.getElementById("check-form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
            }}
          />
        ) : null}

        {session.view === "examples" ? (
          <ExamplesView
            onBack={goHome}
            onStart={() => {
              goHome();
              window.setTimeout(() => document.getElementById("check-form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
            }}
          />
        ) : null}

        {session.view === "result" && session.reportId && session.index != null ? (
          <ResultView
            reportId={session.reportId}
            query={session.query}
            queryType={session.queryType}
            index={session.index}
            offerEndsAt={session.offerEndsAt ?? Date.now() + 15 * 60 * 1000}
          />
        ) : null}

        {session.view === "pay" && session.reportId && session.payMethod ? (
          <PayView
            method={session.payMethod}
            reportId={session.reportId}
            query={session.query}
            queryType={session.queryType}
            tariff={session.tariff ?? session.preferred ?? "full"}
            onBack={() => {
              patch({ view: "result", resumeView: "result" });
              scrollTopSoon();
            }}
          />
        ) : null}

        {session.view === "tariffs" && session.reportId ? (
          <TariffsView
            reportId={session.reportId}
            preferred={session.preferred}
            onBack={() => {
              patch({ view: "result", resumeView: "result" });
              scrollTopSoon();
            }}
            onChoose={(tariff) => {
              patch({ tariff, view: "manager", resumeView: "manager" });
              scrollTopSoon();
            }}
          />
        ) : null}

        {session.view === "manager" && session.reportId && session.index != null && session.tariff ? (
          <ManagerView
            reportId={session.reportId}
            query={session.query}
            queryType={session.queryType}
            index={session.index}
            tariff={session.tariff}
            onChangeTariff={() => {
              patch({ view: "tariffs", resumeView: "tariffs" });
              scrollTopSoon();
            }}
            onOpenChat={() => {
              const tariff = session.tariff;
              if (!tariff || session.index == null || !session.reportId) return Promise.resolve("fallback");
              return openJivoChat({
                text: leadText({
                  reportId: session.reportId,
                  query: session.query,
                  queryType: session.queryType,
                  index: session.index,
                  tariff,
                }),
                reportId: session.reportId,
                query: session.query,
                queryType: session.queryType,
                tariffLabel: tariffLine(tariff),
                index: session.index,
              });
            }}
          />
        ) : null}

        {session.view === "legal" && session.legal ? (
          <LegalView
            doc={session.legal}
            onBack={() => {
              patch({ view: session.returnView === "legal" ? "home" : session.returnView, legal: null });
              scrollTopSoon();
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
