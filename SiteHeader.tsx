import { OnlineCounter } from "./OnlineCounter";

export function SiteHeader({
  onLogo,
  reportId,
  scanBadge,
  blogCurrent,
}: {
  onLogo: () => void;
  reportId?: string | null;
  scanBadge?: string | null;
  blogCurrent?: boolean;
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <button type="button" className="logo-btn" onClick={onLogo}>
          <span className="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 36 36" width="36" height="36">
              <rect className="logo-plate" x="1" y="1" width="34" height="34" rx="10" />
              <circle className="logo-ring" cx="18" cy="18" r="15" />
              <path
                className="logo-heart"
                d="M18 27.2c-.4 0-7.4-4.4-9.5-8.8-1.5-3.1-.4-6.5 2.6-7.4 1.7-.5 3.3.1 4.3 1 .5.4.9.9 1.3 1.4L18 15.1l1.3-1.7c.4-.5.8-1 1.3-1.4 1-.9 2.6-1.5 4.3-1 3 .9 4.1 4.3 2.6 7.4-2.1 4.4-9.1 8.8-9.5 8.8z"
              />
              <path className="logo-check" d="M14.6 17.2l2.1 2.1 4.4-4.6" />
            </svg>
          </span>
          <span className="logo-word">Check-Love</span>
        </button>
        <nav className="nav-anchors" aria-label="Разделы">
          <a href="/reviews">Отзывы</a>
          <a href="/examples">Примеры проверок</a>
          <a href="/blog" aria-current={blogCurrent ? "page" : undefined}>
            Блог
          </a>
        </nav>
        {reportId ? <span className="header-report">{reportId}</span> : null}
        {scanBadge ? <span className="ver-badge">{scanBadge}</span> : null}
        <div className="header-spacer">
          <OnlineCounter />
        </div>
      </div>
    </header>
  );
}
