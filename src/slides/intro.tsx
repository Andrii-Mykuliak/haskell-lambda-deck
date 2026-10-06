import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { At, Chip, HaskellLogo, Slide } from "../deck/ui";
import { clamp01 } from "./common";

const TitleSlide: React.FC = () => {
  const { s, t } = useSteps();
  const lines = ["Лямбда-числення", "і його застосування", "в Haskell"];
  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 1.2);
      return (
        <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px)`, whiteSpace: "pre" }}>
          {ch}
        </span>
      );
    });
  const glow = interpolate(t(0, 40), [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Slide>
      <div style={{ position: "absolute", right: 0, top: 14, width: 760, height: 540, background: "#141821", opacity: s(0, 0) }} />
      <div style={{ position: "absolute", right: 60, top: 70, filter: `drop-shadow(0 0 ${40 * glow}px rgba(143,78,139,0.35))` }}>
        <HaskellLogo size={680} p1={s(0, 4, POP)} p2={s(0, 12, POP)} p3={s(0, 22, POP)} />
      </div>
      <At x={116} y={190} step={0} delay={8} size={60} weight={800} color={C.pink}>
        Лекція 3
      </At>
      <div style={{ position: "absolute", left: 110, top: 300, fontFamily: F.head, fontWeight: 800, fontSize: 88, lineHeight: 1.12, color: C.text }}>
        {lines.map((l, i) => (
          <div key={i}>{letters(l, 14 + i * 14)}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 640,
          height: 6,
          width: mix(0, 520, s(0, 60)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={116} y={680} step={0} delay={66} size={36} weight={400} color={C.dim} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        {"M ::= x | λx.M | M N"}
      </At>
    </Slide>
  );
};

/* Epigraph: three constructions are enough to compute; AND TRUE FALSE is reduced to FALSE using nothing else. */
const BLOCKS: { code: string; name: string; color: string }[] = [
  { code: "x", name: "змінна", color: C.lav },
  { code: "λx.M", name: "абстракція", color: C.accentHi },
  { code: "M N", name: "аплікація", color: C.mint },
];
const TRACE_AT = 60;
const TRACE_STEP = 30;

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (str: string, base: number, color?: string) =>
    str.split(" ").map((w, i) => {
      const p = s(0, base + i * 5, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)`, color }}>
          {w + " "}
        </span>
      );
    });
  const panel = (x: number, w: number, p: number, title: string, color: string, children: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 300,
        width: w,
        height: 410,
        borderRadius: 20,
        background: C.panel,
        border: `3px solid ${color}`,
        boxSizing: "border-box",
        opacity: clamp01(p),
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 30, top: 22, fontFamily: F.body, fontWeight: 800, fontSize: 28, color }}>{title}</div>
      {children}
    </div>
  );
  const at = (k: number) => TRACE_AT + k * TRACE_STEP;
  return (
    <Slide>
      <div style={{ position: "absolute", left: 110, top: 100, width: 1720, fontFamily: F.head, fontWeight: 800, fontSize: 58, lineHeight: 1.22, color: C.text }}>
        <div>
          {words("The λ-calculus can be called the", 6)}
          {words("smallest universal", 36, C.accentHi)}
        </div>
        <div>
          {words("programming language", 48, C.accentHi)}
          {words("in the world.", 58)}
        </div>
      </div>
      {panel(
        112,
        480,
        s(0, 10, POP),
        "три конструкції",
        C.lav,
        BLOCKS.map((b, i) => {
          const p = s(0, 16 + i * 8, POP);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 30,
                top: 96 + i * 100,
                display: "flex",
                alignItems: "center",
                gap: 22,
                opacity: clamp01(p),
                transform: `translateX(${(1 - p) * -30}px)`,
              }}
            >
              <Chip size={34} color={b.color} border={b.color} style={{ minWidth: 150 }}>
                {b.code}
              </Chip>
              <span style={{ fontFamily: F.body, fontSize: 30, color: C.text }}>{b.name}</span>
            </div>
          );
        }),
      )}
      {panel(
        632,
        1176,
        s(0, 18, POP),
        "і цього досить, щоб обчислювати",
        C.mint,
        <>
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 72,
              fontFamily: F.mono,
              fontWeight: 600,
              fontSize: 24,
              lineHeight: "34px",
              color: C.dim,
              whiteSpace: "pre",
              fontVariantLigatures: "none",
              opacity: clamp01(s(0, 30)),
            }}
          >
            {"TRUE  = λx.λy. x      FALSE = λx.λy. y\nAND   = λp.λq. p q FALSE"}
          </div>
          <Code
            x={30}
            y={160}
            size={30}
            step={0}
            lh={44}
            code={`
              @0+${at(0)} [[0@${at(0) + 8}~${TRACE_STEP}|AND TRUE]] FALSE
              @0+${at(1)} → [[0@${at(1) + 8}~${TRACE_STEP}|(λq. TRUE q FALSE) FALSE]]
              @0+${at(2)} → [[0@${at(2) + 8}~${TRACE_STEP}|TRUE FALSE]] FALSE
              @0+${at(3)} → [[0@${at(3) + 8}~${TRACE_STEP}|(λy. FALSE) FALSE]]
              @0+${at(4)} → [[0@${at(4) + 8}|FALSE]]
            `}
          />
        </>,
      )}
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 740,
          height: 6,
          width: mix(0, 420, s(1, 0)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={110} y={770} w={1700} step={1} delay={6} size={44} weight={600} color={C.text}>
        λ-числення можна назвати найменшою універсальною мовою програмування у світі.
      </At>
      <At x={110} y={900} step={1} delay={24} size={34} weight={400} color={C.dim} font={F.mono}>
        Raúl Rojas
      </At>
      <At x={110} y={950} w={1600} step={1} delay={36} size={30} weight={400} color={C.dim}>
        «A Tutorial Introduction to the Lambda Calculus», 2015
      </At>
    </Slide>
  );
};

const AGENDA = [
  "λ-терми і граматика",
  "Абстракція, аплікація, змінні",
  "α-конверсія",
  "β-редукція",
  "η-редукція, нормальні форми і стратегії",
  "Перехід до Haskell: λ-вирази і каррування",
  "Часткове застосування, оператори аплікації, композиція",
];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  const Y0 = 190;
  const GAP = 108;
  const hl = full ? 0 : s(0, 6);
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const isActive = !full && i === active;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 84,
              top: Y0 + i * GAP,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "10px 34px 10px 20px",
              opacity: p * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  background: "rgba(141,118,220,0.13)",
                  border: `2px solid rgba(141,118,220,${0.5 * hl})`,
                  clipPath: `inset(0 ${(1 - hl) * 100}% 0 0 round 14px)`,
                }}
              />
            )}
            <div
              style={{
                position: "relative",
                width: 76,
                height: 64,
                borderRadius: 8,
                background: i % 2 ? "#5e5086" : C.pink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 40,
                color: C.text,
                flexShrink: 0,
                boxShadow: on ? `0 0 ${30 * on}px rgba(178,95,168,${0.6 * on})` : undefined,
                transform: `scale(${1 + 0.12 * on})`,
              }}
            >
              {i + 1}
            </div>
            <div style={{ position: "relative", fontFamily: F.body, fontSize: 48, fontWeight: on ? 700 : 400, color: C.text, whiteSpace: "nowrap" }}>
              {item}
            </div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [100], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [230, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
