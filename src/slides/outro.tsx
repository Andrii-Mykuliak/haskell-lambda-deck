import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip } from "../deck/ui";
import { clamp01 } from "./common";
import { CH, Rel } from "./term";

/* Final slide: Ω = (λx. x x)(λx. x x) β-reduces to itself; the function dissolves and the argument copies into its place. */

const CYCLES = 3;
const START = 50;
const CYCLE = 84;
const DONE_AT = START + CYCLES * CYCLE;
const SZ = 54;
const W = CH * SZ;
const X0 = 1150;
const Y = 430;
const HALF = "(λx. x x)";
const ease = Easing.inOut(Easing.cubic);

const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: rnd(i * 5 + 1) * 1920,
  y: rnd(i * 7 + 2) * 1080,
  r: 1 + rnd(i * 11 + 3) * 2,
  v: 0.2 + rnd(i * 13 + 4) * 0.5,
  ph: rnd(i * 17 + 5) * 6.28,
}));

const Half: React.FC<{ x: number; opacity: number; hiX: number; color?: string; glow?: number }> = ({ x, opacity, hiX, color = C.mint, glow = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: Y,
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: SZ,
      lineHeight: 1.3,
      whiteSpace: "pre",
      fontVariantLigatures: "none",
      color,
      opacity,
      textShadow: glow > 0.02 ? `0 0 ${18 * glow}px ${color}` : undefined,
    }}
  >
    {HALF.split("").map((ch, i) => (
      <span key={i} style={{ color: hiX > 0 && (i === 5 || i === 7) ? C.amber : hiX > 0 && i === 2 ? C.accentHi : undefined }}>
        {ch}
      </span>
    ))}
  </div>
);

const Outro: React.FC = () => {
  const { s, frame: f } = useSteps();
  const local = f - START;
  const c = Math.max(0, Math.min(CYCLES - 1, Math.floor(local / CYCLE)));
  const u = local - c * CYCLE;
  const running = local >= 0 && f < DONE_AT;
  const hi = running && u < 30 ? 1 : 0;
  const dissolve = running ? clamp01((u - 14) / 14) * (1 - clamp01((u - 50) / 6)) : 0;
  const travel = running ? ease(clamp01((u - 22) / 26)) : 0;
  const ghostOn = running && u >= 20 && u < 50;
  const steps = local < 0 ? 0 : Math.min(CYCLES, Math.floor((local - 50) / CYCLE) + 1);
  const done = f >= DONE_AT;
  const appear = s(0, 20, POP);
  const credit = s(0, DONE_AT + 40);
  const sweep = interpolate(f, [DONE_AT + 50, DONE_AT + 100], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 74% 46%, rgba(239,107,107,${0.06 + 0.08 * Math.min(1, steps / 3)}) 0%, ${C.bg} 58%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {STARS.map((st, i) => (
          <circle key={i} cx={st.x} cy={(st.y - f * st.v + 1080 * 4) % 1080} r={st.r} fill="#c4b5fd" opacity={0.22 + 0.22 * Math.sin(f * 0.08 + st.ph)} />
        ))}
      </svg>

      <div style={{ position: "absolute", left: X0 - 150, top: Y, fontFamily: F.mono, fontWeight: 700, fontSize: SZ, lineHeight: 1.3, color: C.red, opacity: Math.min(1, appear) }}>
        Ω =
      </div>
      <div style={{ opacity: Math.min(1, appear), transform: `translateY(${(1 - appear) * 20}px)` }}>
        <Half x={X0} opacity={1 - dissolve} hiX={hi} />
        <Half x={X0 + 9 * W} opacity={1} hiX={0} color={running && u < 50 ? C.amber : C.mint} glow={running && u < 50 ? 1 : 0} />
        {ghostOn && <Half x={mix(X0 + 9 * W, X0, travel)} opacity={1} hiX={0} color={C.amber} glow={1} />}
      </div>
      <div
        style={{
          position: "absolute",
          left: X0,
          top: Y + 96,
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 28,
          color: C.dim,
          whiteSpace: "pre",
          fontVariantLigatures: "none",
          opacity: clamp01(s(0, START - 10)),
        }}
      >
        <Rel op="→" sub="β" color={C.amber} />
        {"  тіло x x, де x := (λx. x x)"}
      </div>
      <div style={{ position: "absolute", left: X0, top: Y + 170, opacity: clamp01(s(0, START)) }}>
        <Chip size={32} color={done ? C.red : C.amber} border={done ? C.red : C.amber}>
          {`β-кроків: ${steps}`}
        </Chip>
      </div>
      <div
        style={{
          position: "absolute",
          left: X0,
          top: Y + 260,
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 32,
          color: C.red,
          opacity: clamp01(s(0, DONE_AT)),
        }}
      >
        і так без кінця: нормальної форми немає
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

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [DONE_AT + 150], C: Outro };
