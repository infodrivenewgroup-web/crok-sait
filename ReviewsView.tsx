import { ChevronLeft, Star } from "lucide-react";
import { visibleReviews } from "@/lib/check-love/review-schedule";

export function ReviewsView({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <div className="wrap funnel">
      <button type="button" className="text-back" onClick={onBack}>
        <ChevronLeft size={16} aria-hidden="true" /> На главную
      </button>
      <p className="kicker">Отзывы</p>
      <h1>Люди, которые уже посмотрели факты</h1>
      <p className="lede">
        Имена изменены. Здесь только то, что человек увидел в отчёте: без доступа к телефону и без сцены дома.
      </p>
      <div className="score review-score">
        <strong>4.9 из 5</strong>
        <span>3 500+ проверок</span>
      </div>
      <div className="review-grid">
        {visibleReviews().map((review) => (
          <figure key={review.id} className="review">
            <figcaption>
              <span className="avatar" style={{ background: review.hue }} aria-hidden="true">
                {review.initials}
              </span>
              <span className="review-who">
                <strong>
                  {review.name}, {review.age}
                </strong>
                <small>{review.city}</small>
              </span>
              <em>{review.chip}</em>
            </figcaption>
            <p className="stars" aria-label={`${review.stars} из 5`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={14} fill={index < review.stars ? "currentColor" : "none"} aria-hidden="true" />
              ))}
            </p>
            <blockquote>{review.text}</blockquote>
          </figure>
        ))}
      </div>
      <button type="button" className="btn-cta" onClick={onStart}>
        Начать свою проверку
      </button>
    </div>
  );
}
