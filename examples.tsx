import { createFileRoute } from "@tanstack/react-router";
import { ExamplesView } from "@/components/check-love/views/ExamplesView";
import { SiteHeader } from "@/components/check-love/SiteHeader";
import { pageHead } from "@/lib/check-love/page-head";
import { getSiteOrigin } from "@/lib/check-love/origin";

const TITLE = "Примеры проверок: так выглядит готовый отчёт";
const DESCRIPTION =
  "Образец отчёта Check-Love по открытым данным: какие разделы собираются по номеру или странице VK и что остаётся закрытым до оплаты.";

export const Route = createFileRoute("/examples")({
  loader: async () => ({ origin: await getSiteOrigin().catch(() => "") }),
  head: ({ loaderData }) => pageHead(TITLE, DESCRIPTION, "/examples", loaderData?.origin ?? ""),
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <div className="app-root">
      <SiteHeader onLogo={() => window.location.assign("/")} />
      <ExamplesView onBack={() => window.location.assign("/")} onStart={() => window.location.assign("/")} />
    </div>
  );
}
