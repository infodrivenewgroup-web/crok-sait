import { useEffect, useState } from "react";

function pickCount(prev: number) {
  let next = 3 + Math.floor(Math.random() * 7);
  if (next === prev) next = prev === 9 ? 3 : prev + 1;
  return next;
}

export function OnlineCounter() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    setCount(pickCount(5));
    let timer = 0;
    const tick = () => {
      setCount((prev) => pickCount(prev));
      timer = window.setTimeout(tick, 20_000 + Math.floor(Math.random() * 10_001));
    };
    timer = window.setTimeout(tick, 20_000 + Math.floor(Math.random() * 10_001));
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <span className="online">
      <i />
      <span className="online-count">{count} онлайн</span>
    </span>
  );
}
