import { useEffect, useState } from "react";

const SOURCE = "01CL+·×";

function columnText(index: number): string {
  let text = "";
  for (let row = 0; row < 36; row += 1) {
    text += SOURCE[(index * 5 + row * 3) % SOURCE.length];
    text += "\n";
  }
  return text;
}

export function Atmosphere({ rain }: { rain: boolean }) {
  const [showRain, setShowRain] = useState(false);

  useEffect(() => {
    if (!rain) {
      setShowRain(false);
      return;
    }
    const mobile = window.matchMedia("(max-width: 767px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowRain(!mobile.matches && !reduce.matches);
    update();
    mobile.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, [rain]);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="grid-overlay" />
      {showRain ? (
        <div className="rain-field">
          {Array.from({ length: 22 }, (_, index) => (
            <span
              key={index}
              className={index % 6 === 0 ? "rain-col is-cool" : "rain-col"}
              style={{
                animationDuration: `${16 + (index % 5) * 3}s`,
                animationDelay: `${-(index % 9) * 1.4}s`,
              }}
            >
              {columnText(index)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
