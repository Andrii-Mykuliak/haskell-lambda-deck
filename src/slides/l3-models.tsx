import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Slide } from "../deck/ui";
import { clamp01 } from "./common";

const Box: React.FC<{ x: number; y: number; w: number; h: number; p: number; color: string; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  p,
  color,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 20,
      background: C.panel,
      border: `3px solid ${color}`,
      boxSizing: "border-box",
      opacity: clamp01(p),
      transform: `translateY(${(1 - p) * 30}px)`,
    }}
  >
    {children}
  </div>
);

const Center: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 34, color = C.text }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontFamily: F.body,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.3,
      color,
      padding: "0 24px",
    }}
  >
    {children}
  </div>
);

/* 13 · Теза Черча–Тюрінга */
const MODELS = ["λ-числення", "машина Тюрінга", "рекурсивні функції"];

const S13: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Теза Черча–Тюрінга">
      <Lead>
        Клас <A>алгоритмічно обчислюваних</A> функцій збігається з класами функцій, заданих основними формальними моделями обчислень.
      </Lead>
      <Box x={96} y={380} w={440} h={260} p={s(1, 0, POP)} color={C.accentHi}>
        <Center>
          алгоритмічно
          <br />
          обчислювані функції
          <span style={{ fontSize: 24, fontWeight: 400, color: C.dim, marginTop: 10 }}>інтуїтивне поняття</span>
        </Center>
      </Box>
      <At x={566} y={452} step={2} size={80} weight={700} color={C.amber}>
        ≡
      </At>
      <Box x={660} y={330} w={1164} h={360} p={s(2, 4, POP)} color={C.mint}>
        <div style={{ position: "absolute", left: 32, top: 24, fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.mint }}>
          формально обчислювані функції
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 140, display: "flex", alignItems: "center", gap: 26 }}>
          {MODELS.map((m, i) => {
            const p = s(2, 16 + i * 12, POP);
            return (
              <React.Fragment key={i}>
                <div style={{ opacity: clamp01(p), transform: `scale(${0.7 + 0.3 * p})` }}>
                  <Chip size={28} color={C.text} border={C.line} bg={C.panel2}>
                    {m}
                  </Chip>
                </div>
                {i < 2 && (
                  <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 52, color: C.amber, opacity: clamp01(s(2, 26 + i * 12)) }}>≡</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 40, top: 260, fontFamily: F.body, fontSize: 28, color: C.dim, opacity: clamp01(s(2, 60)) }}>
          основні формальні моделі обчислень
        </div>
      </Box>
      <At x={96} y={790} w={1720} step={3} size={36}>
        Йдеться про <A>збіг класів функцій</A>, а не про швидкість, стиль запису чи зручність конкретної моделі.
      </At>
    </Slide>
  );
};

/* 14 · Приклад: логічне AND у двох моделях */
const TAPE = ["1", "0", "", "", "", ""];
const TM_STEPS = [
  { at: 0, head: 0, state: "q0", say: "q0: читає 1 → крок вправо" },
  { at: 34, head: 1, state: "q1", say: "q1: читає 0 → результат 0" },
  { at: 68, head: 2, state: "стоп", say: "записує 0 і зупиняється" },
];

const TuringPanel: React.FC = () => {
  const { s, t } = useSteps();
  const f = t(1, 10);
  const cur = TM_STEPS.filter((st) => f >= st.at).length - 1;
  const st = TM_STEPS[Math.max(0, cur)];
  const prev = TM_STEPS[Math.max(0, cur - 1)];
  const move = cur <= 0 ? 1 : clamp01((f - st.at) / 14);
  const headCell = prev.head + (st.head - prev.head) * move;
  const X0 = 40;
  const P = 110;
  const written = f >= 82;
  return (
    <>
      <div style={{ position: "absolute", left: X0, top: 84, fontFamily: F.body, fontSize: 28, color: C.dim, lineHeight: 1.5 }}>
        приклад: <M>1 ∧ 0</M>, вхід на стрічці: <M>10</M>
      </div>
      {TAPE.map((v, i) => {
        const val = i === 2 && written ? "0" : v;
        const hot = i === 2 && written;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X0 + i * P,
              top: 236,
              width: 100,
              height: 84,
              border: `3px solid ${hot ? C.mint : C.line}`,
              background: hot ? "rgba(134,224,168,0.18)" : C.panel2,
              color: hot ? C.mint : C.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 40,
              boxSizing: "border-box",
            }}
          >
            {val}
          </div>
        );
      })}
      <svg width={900} height={500} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clamp01(s(1, 4)) }}>
        <polygon
          points={`${X0 + headCell * P + 50},${226} ${X0 + headCell * P + 32},${196} ${X0 + headCell * P + 68},${196}`}
          fill={C.amber}
        />
      </svg>
      <div style={{ position: "absolute", left: X0 + headCell * P + 8, top: 156, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.amber, opacity: clamp01(s(1, 4)) }}>
        {st.state}
      </div>
      <div style={{ position: "absolute", left: X0, top: 350, fontFamily: F.mono, fontWeight: 600, fontSize: 26, color: C.text, opacity: clamp01(s(1, 6)) }}>
        {st.say}
      </div>
      <div style={{ position: "absolute", left: X0, top: 400, fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.mint, opacity: clamp01(s(1, 96)) }}>
        результат: 0
      </div>
    </>
  );
};

const S14: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Приклад: логічне AND у двох моделях">
      <Lead>
        Ту саму булеву операцію можна задати і машиною Тюрінга, і λ-виразом. В обох випадках маємо логічне «і».
      </Lead>
      <Box x={96} y={320} w={820} h={480} p={s(1, 0, POP)} color={C.pink}>
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.pink }}>машина Тюрінга</div>
        <TuringPanel />
      </Box>
      <At x={926} y={520} step={2} size={52} weight={700} color={C.amber}>
        ⇔
      </At>
      <Box x={1004} y={320} w={820} h={480} p={s(2, 0, POP)} color={C.mint}>
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.mint }}>λ-вираз</div>
        <Code
          x={40}
          y={100}
          size={32}
          step={2}
          delay={10}
          stagger={10}
          code={`
            TRUE  ≡ λx.λy. x
            FALSE ≡ λx.λy. y
            AND   ≡ λp.λq. p q FALSE

            @2+60 AND TRUE FALSE  ⇒  [[2@76|FALSE]]
          `}
        />
      </Box>
      <At x={96} y={840} w={1720} step={3} size={34}>
        Один формалізм задає цю операцію діями над стрічкою, інший – через функції й Church-значення. Обчислювана функція при цьому{" "}
        <A>та сама</A>.
      </At>
    </Slide>
  );
};

/* 15 · Що саме є еквівалентним */
const S15: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Що саме є еквівалентним">
      <Lead>
        Різні моделі мають різний синтаксис і різний спосіб міркування, але однакову відповідь на питання: які функції можна обчислити
        алгоритмічно.
      </Lead>
      <Box x={96} y={360} w={620} h={240} p={s(1, 0, POP)} color={C.accentHi}>
        <Center size={40}>
          λ-числення
          <span style={{ fontSize: 28, fontWeight: 400, color: C.dim, marginTop: 8 }}>редукція термів</span>
        </Center>
      </Box>
      <Box x={1204} y={360} w={620} h={240} p={s(1, 10, POP)} color={C.pink}>
        <Center size={40}>
          машина Тюрінга
          <span style={{ fontSize: 28, fontWeight: 400, color: C.dim, marginTop: 8 }}>стани і стрічка</span>
        </Center>
      </Box>
      <Arrow x1={736} y1={450} x2={1184} y2={450} step={2} dur={16} color={C.amber} />
      <Arrow x1={1184} y1={510} x2={736} y2={510} step={2} delay={10} dur={16} color={C.amber} />
      <At x={736} y={536} w={448} step={2} delay={20} size={28} weight={600} color={C.amber} align="center">
        та сама множина
        <br />
        обчислюваних функцій
      </At>
      <At x={96} y={720} w={1720} step={3} size={36}>
        Еквівалентність означає: якщо функція <A>обчислювана</A> в одній з цих моделей, вона обчислювана і в інших.
      </At>
    </Slide>
  );
};

export const t5bSlides: SlideDef[] = [
  { id: "church-turing", title: "Теза Черча–Тюрінга", steps: [45, 50, 90, 55], C: S13 },
  { id: "and-two-models", title: "AND у двох моделях", steps: [45, 130, 100, 55], C: S14 },
  { id: "equivalence", title: "Що еквівалентне", steps: [45, 50, 60, 55], C: S15 },
];
