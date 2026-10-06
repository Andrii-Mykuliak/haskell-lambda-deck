import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { A, Arrow, At } from "../deck/ui";
import { clamp01 } from "./common";

/* Final slide: Church numerals. A number n is "apply f n times"; PLUS 2 3 joins two chains of applications into one of length 5. */

const NUMERALS = ["λf.λx. x", "λf.λx. f x", "λf.λx. f (f x)", "λf.λx. f (f (f x))"];
const ROW_AT = (n: number) => 24 + n * 26;
const ROW_Y = (n: number) => 200 + n * 104;
const CODE_X = 960;
const CHAIN_X = 1420;
const NODE = 46;
const LINK = 34;
const PITCH = NODE + LINK;
const PLUS_AT = ROW_AT(4) + 20;
const N_AT = PLUS_AT + 34;
const M_AT = N_AT + 3 * 10 + 24;
const RESULT_AT = M_AT + 2 * 10 + 30;
const DONE_AT = RESULT_AT + 30;
const PLUS_Y = 690;
const PLUS_X = 960;

const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({ length: 50 }, (_, i) => ({
  x: rnd(i * 5 + 1) * 1920,
  y: rnd(i * 7 + 2) * 1080,
  r: 1 + rnd(i * 11 + 3) * 1.6,
  v: 0.15 + rnd(i * 13 + 4) * 0.3,
  ph: rnd(i * 17 + 5) * 6.28,
}));

const Mono: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.mint }) => (
  <span style={{ fontFamily: F.mono, fontWeight: 700, color: c }}>{children}</span>
);

const Node: React.FC<{ x: number; y: number; p: number; label: string; color: string; round?: boolean }> = ({ x, y, p, label, color, round }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: NODE,
      height: NODE,
      borderRadius: round ? NODE : 10,
      border: `3px solid ${color}`,
      background: round ? "rgba(196,181,253,0.12)" : C.panel2,
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: 24,
      boxSizing: "border-box",
      opacity: clamp01(p),
      transform: `scale(${0.6 + 0.4 * p})`,
    }}
  >
    {label}
  </div>
);

/** x followed by `count` applications of f, drawn left to right starting at frame `at`. */
const Chain: React.FC<{ x: number; y: number; count: number; at: number; colors: string[]; gap?: number; times?: number[] }> = ({
  x,
  y,
  count,
  at,
  colors,
  gap = 10,
  times,
}) => {
  const { s } = useSteps();
  return (
    <>
      <Node x={x} y={y} p={s(0, at, POP)} label="x" color={C.lav} round />
      {Array.from({ length: count }, (_, k) => {
        const t = times ? times[k] : at + 6 + k * gap;
        const nx = x + (k + 1) * PITCH;
        return (
          <React.Fragment key={k}>
            <Arrow x1={nx - LINK + 2} y1={y + NODE / 2} x2={nx - 4} y2={y + NODE / 2} step={0} delay={t} dur={6} color={C.dim} width={3} />
            <Node x={nx} y={y} p={s(0, t + 4, POP)} label="f" color={colors[k]} />
          </React.Fragment>
        );
      })}
    </>
  );
};

const Outro: React.FC = () => {
  const { s, frame: f } = useSteps();
  const credit = s(0, DONE_AT + 20);
  const sweep = interpolate(f, [DONE_AT + 30, DONE_AT + 80], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 2, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 50}px)` }}>
          {ch}
        </span>
      );
    });

  const braces = [
    { from: 1, to: 3, at: N_AT + 26, label: "n = 3", color: C.mint },
    { from: 4, to: 5, at: M_AT + 16, label: "m = 2", color: C.pink },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 72% 52%, rgba(141,118,220,0.16) 0%, ${C.bg} 60%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {STARS.map((st, i) => (
          <circle key={i} cx={st.x} cy={(st.y - f * st.v + 1080 * 4) % 1080} r={st.r} fill="#c4b5fd" opacity={0.2 + 0.2 * Math.sin(f * 0.06 + st.ph)} />
        ))}
      </svg>

      <At x={CODE_X} y={110} w={880} step={0} delay={10} size={30} weight={600} color={C.dim}>
        Числа Черча: число <Mono c={C.text}>n</Mono> – це «застосувати <Mono c={C.amber}>f</Mono> n разів до <Mono c={C.lav}>x</Mono>»
      </At>
      {NUMERALS.map((def, n) => {
        const p = clamp01(s(0, ROW_AT(n)));
        return (
          <React.Fragment key={n}>
            <div
              style={{
                position: "absolute",
                left: CODE_X,
                top: ROW_Y(n) + 4,
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 28,
                color: C.mint,
                whiteSpace: "pre",
                fontVariantLigatures: "none",
                opacity: p,
                transform: `translateX(${(1 - p) * -20}px)`,
              }}
            >
              <span style={{ color: C.text }}>{n}</span>
              <span style={{ color: C.dim }}>{" ≡ "}</span>
              {def}
            </div>
            <Chain x={CHAIN_X} y={ROW_Y(n)} count={n} at={ROW_AT(n) + 4} colors={Array(n).fill(C.amber)} gap={6} />
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: PLUS_X,
          top: PLUS_Y - 64,
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 26,
          color: C.dim,
          whiteSpace: "pre",
          fontVariantLigatures: "none",
          opacity: clamp01(s(0, PLUS_AT)),
        }}
      >
        {"PLUS ≡ λm.λn.λf.λx. "}
        <span style={{ color: C.pink }}>m f</span>
        {" ("}
        <span style={{ color: C.mint }}>n f x</span>
        {")"}
      </div>
      <div
        style={{
          position: "absolute",
          left: PLUS_X,
          top: PLUS_Y + 6,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          color: C.text,
          whiteSpace: "pre",
          opacity: clamp01(s(0, PLUS_AT + 8)),
        }}
      >
        PLUS 2 3
      </div>
      <Chain
        x={PLUS_X + 200}
        y={PLUS_Y}
        count={5}
        at={N_AT}
        colors={[C.mint, C.mint, C.mint, C.pink, C.pink]}
        times={[N_AT + 6, N_AT + 16, N_AT + 26, M_AT, M_AT + 10]}
      />
      {braces.map((b, i) => {
        const p = clamp01(s(0, b.at));
        const x1 = PLUS_X + 200 + b.from * PITCH;
        const x2 = PLUS_X + 200 + b.to * PITCH + NODE;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x1, top: PLUS_Y + NODE + 10, width: (x2 - x1) * p, height: 4, borderRadius: 2, background: b.color }} />
            <div
              style={{
                position: "absolute",
                left: x1,
                width: x2 - x1,
                top: PLUS_Y + NODE + 20,
                textAlign: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 22,
                color: b.color,
                opacity: p,
              }}
            >
              {b.label}
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: PLUS_X,
          top: PLUS_Y + 124,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          color: C.mint,
          whiteSpace: "pre",
          fontVariantLigatures: "none",
          opacity: clamp01(s(0, RESULT_AT)),
          transform: `translateY(${(1 - clamp01(s(0, RESULT_AT))) * 14}px)`,
        }}
      >
        <span style={{ color: C.text }}>{"⇒ 5 ≡ "}</span>
        {"λf.λx. f (f (f (f (f x))))"}
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

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [DONE_AT + 120], C: Outro };
