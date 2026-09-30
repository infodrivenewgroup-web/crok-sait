import type { ScanModuleFrame } from "@/lib/check-love/scan";
import { PHASE_LABEL } from "@/lib/check-love/scan";

const NIGHT_LABELS = ["19", "20", "21", "22", "23", "00", "01", "02", "03", "04", "05", "06"];
const NIGHT_HEIGHTS = [28, 36, 42, 50, 74, 88, 80, 94, 70, 52, 40, 30];

function Tiles({ items }: { items: ScanModuleFrame["items"] }) {
  return (
    <ul className="tile-grid">
      {items.map((item) => (
        <li key={item.id} className={`tile phase-${item.phase}`}>
          <span>{item.label}</span>
          <em>{PHASE_LABEL[item.phase]}</em>
        </li>
      ))}
    </ul>
  );
}

function VkScene({ localT }: { localT: number }) {
  const nodes = [
    { x: 180, y: 92, lock: false },
    { x: 78, y: 48, lock: true },
    { x: 286, y: 44, lock: false },
    { x: 64, y: 132, lock: true },
    { x: 300, y: 128, lock: false },
    { x: 124, y: 164, lock: true },
    { x: 240, y: 158, lock: false },
  ];
  const shown = Math.max(1, Math.ceil(localT * nodes.length));
  return (
    <svg className="scene-svg" viewBox="0 0 360 200" role="img" aria-label="Схема открытого графа">
      {nodes.slice(0, shown).map((node, index) =>
        index === 0 ? null : (
          <line
            key={`e-${node.x}`}
            x1="180"
            y1="92"
            x2={node.x}
            y2={node.y}
            className="graph-edge"
          />
        ),
      )}
      {nodes.slice(0, shown).map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <circle cx={node.x} cy={node.y} r={node.lock ? 11 : 14} className={node.lock ? "graph-node lock" : "graph-node"} />
          {node.lock ? <text x={node.x} y={node.y + 3} textAnchor="middle" className="graph-lock">×</text> : null}
        </g>
      ))}
    </svg>
  );
}

function TelegramScene({ localT }: { localT: number }) {
  return (
    <div className="night-chart" aria-hidden="true">
      {NIGHT_LABELS.map((label, index) => {
        const night = index >= 4;
        const visible = localT > index / NIGHT_LABELS.length;
        return (
          <div key={label} className="night-col">
            <div className="night-track">
              <div
                className={night ? "night-bar is-night" : "night-bar"}
                style={{ height: visible ? `${NIGHT_HEIGHTS[index]}%` : "4%" }}
              />
            </div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function GeoScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 360 200" role="img" aria-label="Схема публичных точек">
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v-${i}`} x1={30 + i * 42} y1="24" x2={30 + i * 42} y2="176" className="map-line" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`h-${i}`} x1="24" y1={28 + i * 36} x2="336" y2={28 + i * 36} className="map-line" />
      ))}
      {[
        [96, 78],
        [188, 112],
        [262, 64],
      ].map(([x, y], index) => (
        <g key={x}>
          <circle cx={x} cy={y} r="16" className={`map-pulse p${index}`} />
          <circle cx={x} cy={y} r="4.5" className="map-dot" />
        </g>
      ))}
    </svg>
  );
}

export function ModuleScene({
  moduleId,
  items,
  localT,
  moduleNumber,
}: {
  moduleId: string;
  items: ScanModuleFrame["items"];
  localT: number;
  moduleNumber: number;
}) {
  return (
    <div className="scene">
      <div className="scene-meta">
        <span>MOD 0{moduleNumber}</span>
        <span>OPEN SOURCE</span>
      </div>
      {moduleId === "vk" ? <VkScene localT={localT} /> : null}
      {moduleId === "tg" ? <TelegramScene localT={localT} /> : null}
      {moduleId === "geo" ? <GeoScene /> : null}
      {moduleId !== "vk" && moduleId !== "tg" && moduleId !== "geo" ? <Tiles items={items} /> : null}
      <p className="scene-caption">
        {moduleId === "tg"
          ? "12 окон. Подсвечены часы 23:00–06:00. Это время, не текст."
          : moduleId === "geo"
            ? "Три публичные точки на схеме. Это не карта города и не маршрут."
            : moduleId === "shops"
              ? "Только аккаунты или профили. Заказы и карта не открываются."
              : "Статусы — ход сбора, не персональные находки."}
      </p>
    </div>
  );
}
