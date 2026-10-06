import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, F, FPS } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip } from "../deck/ui";
import { clamp01, useClock } from "./common";

/* Final slide: Ω = (λx. x x)(λx. x x) never reaches a normal form, so its β-steps loop for as long as the slide is shown. */

const CX = 1360;
const CY = 500;
const R_OUT = 330;
const R_MID = 224;
const N_LAMBDA = 32;
const PERIOD = 1.9;
const LOOP_START = 2.6;
const INHALE = 0.34;
const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);

const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: rnd(i * 5 + 1) * 1920,
  y: rnd(i * 7 + 2) * 1080,
  r: 0.8 + rnd(i * 11 + 3) * 2.2,
  v: 0.15 + rnd(i * 13 + 4) * 0.45,
  ph: rnd(i * 17 + 5) * 6.28,
}));

const INFLOW = Array.from({ length: 44 }, (_, i) => ({ a: rnd(i * 3 + 7) * Math.PI * 2, d: rnd(i * 5 + 9) * 0.45, hue: rnd(i * 7 + 11) * 360 }));
const SPARKS = Array.from({ length: 40 }, (_, i) => ({ a: (i / 40) * Math.PI * 2 + rnd(i) * 0.2, v: 0.7 + rnd(i * 9 + 2) * 0.6, hue: rnd(i * 13 + 4) * 360 }));

const TERM_RING = "(λx. x x)(λx. x x)  →β  ".repeat(3);

const Outro: React.FC = () => {
  const { s, frame: f } = useSteps();
  const sec = Math.max(useClock(), f / FPS);
  const appear = s(0, 6, POP);
  const loop = Math.max(0, sec - LOOP_START);
  const looping = sec >= LOOP_START;
  const cycle = Math.floor(loop / PERIOD);
  const ph = (loop % PERIOD) / PERIOD;
  const inhale = looping && ph < INHALE ? easeIn(ph / INHALE) : 0;
  const after = looping && ph >= INHALE ? (ph - INHALE) / (1 - INHALE) : 1;
  const burst = looping && ph >= INHALE ? 1 - easeOut(clamp01(after / 0.7)) : 0;
  const steps = looping ? cycle + (ph >= INHALE ? 1 : 0) : 0;
  const hue = (sec * 24) % 360;
  const rotOut = sec * 0.22;
  const rotMid = -sec * 16;
  const wave = after * Math.PI * 2;
  const credit = s(0, 80);
  const sweep = interpolate(f, [90, 140], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 2, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 50}px)` }}>
          {ch}
        </span>
      );
    });

  return (
    <AbsoluteFill style={{ background: "#120f1f", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(circle at ${(CX / 1920) * 100}% ${(CY / 1080) * 100}%, hsla(${hue}, 85%, 62%, ${0.22 + 0.25 * burst}) 0%, transparent 38%)`,
            `radial-gradient(circle at ${(CX / 1920) * 100 + 8}% ${(CY / 1080) * 100 + 14}%, hsla(${(hue + 120) % 360}, 85%, 60%, 0.16) 0%, transparent 42%)`,
            `radial-gradient(circle at ${(CX / 1920) * 100 - 10}% ${(CY / 1080) * 100 - 12}%, hsla(${(hue + 240) % 360}, 85%, 62%, 0.14) 0%, transparent 40%)`,
            C.bg,
          ].join(", "),
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <path id="mid-ring" d={`M ${CX - R_MID} ${CY} a ${R_MID} ${R_MID} 0 1 1 ${R_MID * 2} 0 a ${R_MID} ${R_MID} 0 1 1 ${-R_MID * 2} 0`} />
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9 * burst} />
            <stop offset="40%" stopColor={`hsl(${hue}, 95%, 70%)`} stopOpacity={0.55 * burst + 0.12} />
            <stop offset="100%" stopColor={`hsl(${hue}, 95%, 60%)`} stopOpacity={0} />
          </radialGradient>
        </defs>
        {STARS.map((st, i) => (
          <circle key={i} cx={st.x} cy={(st.y - f * st.v + 1080 * 4) % 1080} r={st.r} fill="#e9e3ff" opacity={0.25 + 0.3 * Math.sin(sec * 2 + st.ph)} />
        ))}

        <circle cx={CX} cy={CY} r={170 + 120 * burst} fill="url(#core)" />

        {[0, 1].map((k) => {
          const e = clamp01((after - k * 0.12) / 0.75);
          if (!looping || ph < INHALE || e <= 0 || e >= 1) return null;
          return (
            <circle
              key={k}
              cx={CX}
              cy={CY}
              r={90 + 390 * easeOut(e)}
              fill="none"
              stroke={`hsl(${(hue + k * 60) % 360}, 95%, 72%)`}
              strokeWidth={10 * (1 - e) + 1}
              opacity={(1 - e) * 0.9}
              style={{ filter: `drop-shadow(0 0 14px hsl(${(hue + k * 60) % 360}, 95%, 65%))` }}
            />
          );
        })}

        <g transform={`rotate(${rotMid} ${CX} ${CY})`} opacity={clamp01(s(0, 30))}>
          <circle cx={CX} cy={CY} r={R_MID + 40} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
          <circle cx={CX} cy={CY} r={R_MID - 28} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
          <text
            fill={`hsl(${(hue + 40) % 360}, 95%, 76%)`}
            fontFamily={F.mono}
            fontWeight={700}
            fontSize={28}
            style={{ filter: `drop-shadow(0 0 ${6 + 10 * burst}px hsl(${(hue + 40) % 360}, 95%, 60%))` }}
          >
            <textPath href="#mid-ring">{TERM_RING}</textPath>
          </text>
        </g>

        {looping &&
          ph < INHALE &&
          INFLOW.map((p, i) => {
            const e = clamp01((ph / INHALE - p.d) / (1 - p.d));
            if (e <= 0) return null;
            const ang = p.a + rotOut + e * 1.6;
            const r = R_OUT * (1 - easeIn(e));
            return (
              <circle
                key={i}
                cx={CX + Math.cos(ang) * r}
                cy={CY + Math.sin(ang) * r}
                r={3 + 4 * e}
                fill={`hsl(${(p.hue + hue) % 360}, 95%, 72%)`}
                opacity={0.4 + 0.6 * e}
                style={{ filter: `drop-shadow(0 0 8px hsl(${(p.hue + hue) % 360}, 95%, 65%))` }}
              />
            );
          })}

        {looping &&
          ph >= INHALE &&
          SPARKS.map((p, i) => {
            const e = clamp01(after / 0.6);
            if (e >= 1) return null;
            const r1 = 70 + 420 * Math.pow(e, 0.6) * p.v;
            const r0 = Math.max(60, r1 - 60 * (1 - e));
            const col = `hsl(${(p.hue + hue) % 360}, 100%, 74%)`;
            return (
              <line
                key={i}
                x1={CX + Math.cos(p.a) * r0}
                y1={CY + Math.sin(p.a) * r0}
                x2={CX + Math.cos(p.a) * r1}
                y2={CY + Math.sin(p.a) * r1}
                stroke={col}
                strokeWidth={4 * (1 - e) + 1}
                strokeLinecap="round"
                opacity={1 - e}
                style={{ filter: `drop-shadow(0 0 6px ${col})` }}
              />
            );
          })}
      </svg>

      {Array.from({ length: N_LAMBDA }, (_, i) => {
        const base = (i / N_LAMBDA) * Math.PI * 2;
        const ang = base + rotOut;
        const fly = s(0, 8 + i * 1.3, POP);
        const r = R_OUT * fly;
        const d = Math.atan2(Math.sin(ang - wave), Math.cos(ang - wave));
        const boost = looping && ph >= INHALE ? Math.exp(-(d * d) * 6) * (1 - after * 0.6) : 0;
        const col = `hsl(${(i * (360 / N_LAMBDA) + hue * 2) % 360}, 95%, ${68 + 18 * boost}%)`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CX + Math.cos(ang) * r - 20,
              top: CY + Math.sin(ang) * r - 32,
              width: 40,
              textAlign: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 46,
              lineHeight: "64px",
              color: col,
              opacity: Math.min(1, fly) * (0.75 + 0.25 * boost),
              transform: `rotate(${ang + Math.PI / 2}rad) scale(${1 + 0.55 * boost - 0.15 * inhale})`,
              textShadow: `0 0 ${10 + 22 * boost}px ${col}`,
            }}
          >
            λ
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: CX - 160,
          top: CY - 130,
          width: 320,
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 210,
          lineHeight: 1,
          backgroundImage: `linear-gradient(135deg, hsl(${hue}, 95%, 72%), hsl(${(hue + 90) % 360}, 95%, 72%), hsl(${(hue + 180) % 360}, 95%, 75%))`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: `drop-shadow(0 0 ${18 + 50 * burst}px hsla(${hue}, 95%, 65%, 0.9))`,
          opacity: Math.min(1, appear),
          transform: `scale(${(0.4 + 0.6 * appear) * (1 - 0.12 * inhale + 0.22 * burst)})`,
        }}
      >
        Ω
      </div>

      <div style={{ position: "absolute", left: CX - 220, top: CY + R_OUT + 70, width: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: clamp01(s(0, 40)) }}>
        <Chip size={32} color={C.amber} border={C.amber}>
          {`β-кроків: ${steps}`}
        </Chip>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.pink, whiteSpace: "nowrap" }}>нормальної форми немає</div>
      </div>

      <div style={{ position: "absolute", left: 90, top: 150, fontFamily: F.head, fontWeight: 800, fontSize: 104, lineHeight: 1.12, color: C.text }}>
        <div>{letters("Дякую", 6)}</div>
        <div>{letters("за увагу!", 18)}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 430,
          height: 6,
          width: 440 * s(0, 36),
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
        }}
      />
      <At x={96} y={500} w={780} step={0} delay={44} size={38} weight={700}>
        Наступна лекція: <A>система типів Haskell</A>
      </At>
      <At x={96} y={600} w={780} step={0} delay={56} size={30} weight={400} color={C.dim}>
        Стратегії редукції – самостійне опрацювання.
      </At>
      <At x={96} y={690} w={780} step={0} delay={64} size={32} weight={600} color={C.dim} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        {"Ω = (λx. x x)(λx. x x)"}
      </At>
      <div style={{ position: "absolute", left: 96, top: 900, opacity: credit, transform: `translateY(${(1 - credit) * 16}px)` }}>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 2,
            backgroundImage: `linear-gradient(100deg, ${C.dim} 0%, ${C.dim} ${sweep - 12}%, #ffffff ${sweep}%, ${C.dim} ${sweep + 12}%, ${C.dim} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          made with Claude Opus 5.5
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [160], C: Outro };
