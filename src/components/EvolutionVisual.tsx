import type { ReactNode } from "react";

// Visual schematici del Percorso evolutivo: molta complessità a sinistra, un risultato semplice a destra.
const mono = { fontFamily: "ui-monospace, SFMono-Regular, monospace" } as const;
const t = (size = 6.5, ls = 0.6) => ({ ...mono, fontSize: size, letterSpacing: ls });

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function Result({ x, y, w, label, sub }: { x: number; y: number; w: number; label: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="30" className="ev-core" />
      <text x={x + 7} y={y + 12} style={t(5.5, 0.8)} className="ev-text-light ev-dim">{sub}</text>
      <text x={x + 7} y={y + 23} style={t(8, 0.4)} className="ev-text-light">{label}</text>
    </g>
  );
}

function Foundation() {
  const r = rng(11);
  const rows = Array.from({ length: 16 }, (_, i) => ({ y: 30 + i * 6.6, w: 14 + r() * 26 }));
  const tags = ["ERP", "CRM", "XLS", "WMS"];
  return (
    <>
      {tags.map((s, i) => (
        <text key={s} x="8" y={33 + i * 26.4} style={t(5)} className="ev-text ev-dim">{s}</text>
      ))}
      {rows.map((row, i) => (
        <g key={i}>
          <rect x="24" y={row.y - 1.6} width={row.w} height="3.2" className="ev-bar" />
          <path d={`M${26 + row.w} ${row.y} C 92 ${row.y}, 88 ${60 + (i % 3) * 14}, 108 ${60 + (i % 3) * 14}`} className="ev-line ev-thin" />
        </g>
      ))}
      {["STAGING", "MODELLO", "KPI"].map((l, i) => (
        <g key={l}>
          <path d={`M${108 + i * 10} ${54 + i * 14} l40 0 l8 -8 l-40 0 Z`} className={i === 2 ? "ev-plane ev-plane--hot" : "ev-plane"} />
          <text x={116 + i * 10} y={51 + i * 14} style={t(4.6)} className="ev-text">{l}</text>
        </g>
      ))}
      <path d="M166 82 C 178 82, 176 98, 188 98" className="ev-line ev-accent ev-flow" />
      <Result x={168} y={104} w={64} sub="OUTPUT" label="1 KPI certo" />
    </>
  );
}

function Conversational() {
  const tokens = ["margine", "per", "area", "Q3"];
  const code = [62, 44, 70, 38, 56, 30];
  return (
    <>
      <rect x="10" y="26" width="140" height="15" className="ev-input" />
      <text x="16" y="36" style={t(6.5, 0.3)} className="ev-text-strong">› Margine per area nel Q3?</text>
      {tokens.map((tk, i) => (
        <g key={tk}>
          <rect x={10 + i * 35} y="50" width="31" height="10" className="ev-box" />
          <text x={25.5 + i * 35} y="57" textAnchor="middle" style={t(5, 0.2)} className="ev-text">{tk}</text>
          <path d={`M${25.5 + i * 35} 60 L${i < 2 ? 45 : 115} 72`} className="ev-line ev-thin" />
        </g>
      ))}
      <circle cx="45" cy="74" r="2.2" className="ev-dot-muted" />
      <circle cx="115" cy="74" r="2.2" className="ev-dot-muted" />
      <path d="M45 74 L80 84 L115 74" className="ev-line ev-thin" />
      <circle cx="80" cy="84" r="2.6" className="ev-dot" />
      <text x="10" y="98" style={t(4.6)} className="ev-text ev-dim">SEMANTIC MODEL · MEASURE · FILTER</text>
      {code.map((w, i) => (
        <rect key={i} x={10 + (i % 2) * 6} y={104 + i * 6} width={w} height="2.4" className="ev-bar" />
      ))}
      <path d="M80 87 C 80 110, 150 70, 168 62" className="ev-line ev-accent ev-flow" />
      <g>
        <rect x="168" y="26" width="64" height="66" className="ev-box" />
        {[22, 34, 16, 40].map((h, i) => (
          <rect key={i} x={178 + i * 12} y={84 - h} width="7" height={h} className={i === 3 ? "ev-core" : "ev-bar ev-bar--strong"} />
        ))}
      </g>
      <Result x={168} y={104} w={64} sub="RISPOSTA" label="Area Nord" />
    </>
  );
}

function Contextual() {
  const r = rng(7);
  const nodes = Array.from({ length: 24 }, () => ({ x: 12 + r() * 140, y: 30 + r() * 108 }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((n) => edges.push([i, n.j]));
  });
  const path = [...nodes.map((n, i) => ({ ...n, i }))].sort((a, b) => a.x - b.x).filter((_, k) => k % 6 === 2).slice(0, 4);
  const tags = ["REGOLA", "ECCEZIONE", "GLOSSARIO"];
  return (
    <>
      {edges.map(([a, b], k) => (
        <line key={k} x1={nodes[a]!.x} y1={nodes[a]!.y} x2={nodes[b]!.x} y2={nodes[b]!.y} className="ev-line ev-thin" />
      ))}
      {nodes.map((n, k) => (
        <circle key={k} cx={n.x} cy={n.y} r="1.6" className="ev-dot-muted ev-dim" />
      ))}
      <polyline points={[...path.map((p) => `${p.x},${p.y}`), "168,72"].join(" ")} fill="none" className="ev-line ev-accent ev-flow" />
      {path.map((p, k) => (
        <g key={k}>
          <circle cx={p.x} cy={p.y} r="3" className="ev-dot" />
          {k < 3 && <text x={p.x + 5} y={p.y - 4} style={t(4.6)} className="ev-text">{tags[k]}</text>}
        </g>
      ))}
      <Result x={168} y={58} w={64} sub="KPI + CONTESTO" label="Perché −3%" />
      <text x="168" y="104" style={t(4.6)} className="ev-text ev-dim">24 NODI · 1 PERCORSO</text>
    </>
  );
}

function Automation() {
  const r = rng(3);
  const lanes = [40, 58, 76, 94, 112, 130];
  const gates = [70, 108, 146];
  const ticks: ReactNode[] = [];
  lanes.forEach((y, li) => {
    for (let k = 0; k < 22; k++) {
      const x = 10 + r() * 172;
      const zone = gates.filter((g) => x > g).length;
      const keep = [1, 0.45, 0.18, 0][zone] ?? 0;
      if (r() > keep && zone > 0) continue;
      if (zone === 3) continue;
      ticks.push(<rect key={`${li}-${k}`} x={x} y={y - 2} width="1.4" height="4" className="ev-bar ev-bar--strong" />);
    }
  });
  return (
    <>
      {lanes.map((y) => <line key={y} x1="8" y1={y} x2="182" y2={y} className="ev-line ev-thin" />)}
      {ticks}
      {gates.map((g, i) => (
        <g key={g}>
          <rect x={g - 1} y="30" width="2" height="110" className="ev-gate" />
          <text x={g + 4} y="34" style={t(4.6)} className="ev-text">{["QUALITÀ", "REGOLE", "SOGLIA"][i]}</text>
        </g>
      ))}
      <rect x="160" y="74" width="3" height="4" className="ev-core" />
      <path d="M163 76 C 176 76, 172 62, 186 62" className="ev-line ev-accent ev-flow" />
      <Result x={186} y={48} w={46} sub="TRIGGER" label="Azione" />
    </>
  );
}

const headers: Record<string, [string, string]> = {
  "01": ["FONTI ETEROGENEE", "MODELLO UNICO"],
  "02": ["LINGUAGGIO NATURALE", "QUERY SEMANTICA"],
  "03": ["GRAFO DI CONTESTO", "RISPOSTA SPIEGATA"],
  "04": ["FLUSSO EVENTI", "AZIONE VERIFICATA"],
};

export function EvolutionVisual({ number }: { number: string }) {
  const body = { "01": <Foundation />, "02": <Conversational />, "03": <Contextual />, "04": <Automation /> }[number];
  const [from, to] = headers[number] ?? ["", ""];
  return (
    <svg viewBox="0 0 240 150" className="evolution-visual" aria-hidden="true">
      <defs>
        <pattern id={`evg${number}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.35" className="ev-grid-dot" />
        </pattern>
      </defs>
      <rect width="240" height="150" fill={`url(#evg${number})`} />
      <line x1="8" y1="18" x2="232" y2="18" className="ev-line ev-thin" />
      <text x="8" y="12" style={t(5, 0.9)} className="ev-text ev-dim">{from}</text>
      <text x="232" y="12" textAnchor="end" style={t(5, 0.9)} className="ev-text-hot">→ {to}</text>
      {body}
    </svg>
  );
}
