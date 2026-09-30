import { createFileRoute } from "@tanstack/react-router";
import { ReviewsView } from "@/components/check-love/views/ReviewsView";
import { SiteHeader } from "@/components/check-love/SiteHeader";
import { pageHead } from "@/lib/check-love/page-head";
import { getSiteOrigin } from "@/lib/check-love/origin";

const TITLE = "Отзывы об анонимной проверке на верность — Check-Love";
const DESCRIPTION =
  "Отзывы клиентов об анонимной проверке на верность. Люди рассказывают, что увидели в отчёте по открытым данным: без регистрации, без пароля и без уведомления партнёру.";

export const Route = createFileRoute("/reviews")({
  loader: async () => ({ origin: await getSiteOrigin().catch(() => "") }),
  head: ({ loaderData }) => pageHead(TITLE, DESCRIPTION, "/reviews", loaderData?.origin ?? ""),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="app-root">
      <SiteHeader onLogo={() => window.location.assign("/")} />
      <ReviewsView onBack={() => window.location.assign("/")} onStart={() => window.location.assign("/")} />
    </div>
  );
}

