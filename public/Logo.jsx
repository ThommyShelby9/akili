/**
 * AkiliLogo.jsx — Logo hexagone réseau neuronal animé
 * Variantes : "nav" (petit) | "auth" (moyen) | "hero" (grand)
 */
import React from "react";

export default function AkiliLogo({ variant = "nav", light = false, style = {} }) {
  const sizes = { nav: 32, auth: 48, hero: 180 };
  const textSizes = { nav: 15, auth: 20, hero: 38 };
  const sz = sizes[variant] || 32;
  const tsz = textSizes[variant] || 15;
  const isHero = variant === "hero";
  const color = light ? "#F8FAFC" : "var(--text)";
  const nodeColor = light ? "rgba(248,250,252,0.15)" : "var(--bg-1)";

  return (
    <div style={{ display:"flex", alignItems:"center", gap: isHero ? 16 : 8, ...style }}>
      <svg
        width={sz} height={sz} viewBox="0 0 100 100" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink:0, animation: isHero ? "hexFloat 4s ease-in-out infinite" : "none" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`akili-grad-${variant}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={light ? "#60A5FA" : "#2563EB"} />
            <stop offset="100%" stopColor={light ? "#38BDF8" : "#06B6D4"} />
          </linearGradient>
        </defs>

        {/* Hexagone */}
        <polygon
          points="50,4 93,27 93,73 50,96 7,73 7,27"
          stroke={`url(#akili-grad-${variant})`}
          strokeWidth="2.5"
          fill={light ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.04)"}
          style={{ strokeDasharray:200, strokeDashoffset:0, animation:"drawLine 1.5s ease-out forwards" }}
        />

        {/* Nœud central */}
        <circle cx="50" cy="50" r="5.5"
          fill={`url(#akili-grad-${variant})`}
          style={{ animation:"nodeAppear 0.3s 0.5s ease-out both" }}
        />

        {/* 6 branches + nœuds */}
        {[
          { x2:50, y2:22, nx:50, ny:18 },
          { x2:50, y2:78, nx:50, ny:82 },
          { x2:24, y2:35, nx:20, ny:32 },
          { x2:76, y2:35, nx:80, ny:32 },
          { x2:24, y2:65, nx:20, ny:68 },
          { x2:76, y2:65, nx:80, ny:68 },
        ].map(({ x2, y2, nx, ny }, i) => (
          <g key={i} style={{ animation:`nodeAppear 0.4s ${0.6+i*0.1}s ease-out both` }}>
            <line x1="50" y1="50" x2={x2} y2={y2}
              stroke={light ? "rgba(255,255,255,0.3)" : "rgba(37,99,235,0.35)"}
              strokeWidth="1.5"
            />
            <circle cx={nx} cy={ny} r="5"
              stroke={`url(#akili-grad-${variant})`}
              strokeWidth="1.8"
              fill={nodeColor}
            />
            {/* Petit point central noir */}
            <circle cx={nx} cy={ny} r="2" fill="#111111" />
          </g>
        ))}
      </svg>

      <span style={{
        fontFamily:"'JetBrains Mono', ui-monospace, monospace",
        fontWeight:700,
        fontSize: tsz,
        letterSpacing: isHero ? "0.22em" : "0.15em",
        color,
        textTransform:"uppercase",
        lineHeight:1,
      }}>
        AKILI
      </span>
    </div>
  );
}
