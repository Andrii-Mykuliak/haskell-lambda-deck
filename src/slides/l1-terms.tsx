import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, Lead, M, Mark, Slide } from "../deck/ui";
import { BindArc, CH, Rel, Term } from "./term";

const Under: React.FC<{ cx: number; y: number; w: number; step: number; delay?: number; color: string; children: React.ReactNode }> = ({
  cx,
  y,
  w,
  step,
  delay = 0,
  color,
  children,
}) => {
  const { s } = useSteps();
  const p = s(step, delay);
  return (
    <>
      <div style={{ position: "absolute", left: cx - w / 2, top: y, width: w * Math.min(1, p), height: 5, borderRadius: 3, background: color }} />
      <div
        style={{
          position: "absolute",
          left: cx - 160,
          top: y + 14,
          width: 320,
          textAlign: "center",
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 28,
          color,
          opacity: Math.min(1, p),
        }}
      >
        {children}
      </div>
    </>
  );
};

/* 3 · λ-числення як мова термів */
const S03: React.FC = () => {
  const SZ = 64;
  const col = (c: number) => 96 + c * CH * SZ;
  return (
    <Slide title="λ-числення як мова термів">
      <Lead>
        λ-числення описує обчислення як послідовне перетворення виразів. У мінімальному синтаксисі є лише три конструкції: змінна,
        абстракція та аплікація.
      </Lead>
      <Code x={96} y={340} size={SZ} step={1} code={`M ::= x | λx.M | M N`} />
      <Under cx={col(6.5)} y={438} w={50} step={1} delay={16} color={C.lav}>
        змінна
      </Under>
      <Under cx={col(12)} y={438} w={150} step={1} delay={24} color={C.accentHi}>
        абстракція
      </Under>
      <Under cx={col(18.5)} y={438} w={110} step={1} delay={32} color={C.mint}>
        аплікація
      </Under>
      <At x={96} y={530} step={1} delay={40} size={30} weight={400} color={C.dim}>
        контекстно-вільна граматика у BNF-подібній нотації
      </At>
      <At x={96} y={650} step={2} dir="left" pop>
        <Chip size={40} color={C.text} border={C.line}>
          обчислення
        </Chip>
      </At>
      <At x={420} y={652} step={2} delay={8} size={50} weight={700} color={C.dim}>
        =
      </At>
      <At x={500} y={650} step={2} delay={14} dir="left" pop>
        <Chip size={40} color={C.mint} border={C.mint}>
          редукція термів
        </Chip>
      </At>
      <Code x={96} y={790} size={40} step={2} delay={30} code={`(λx. x) y  →  y      -- один крок редукції`} />
    </Slide>
  );
};

/* 4 · BNF-подібна нотація */
const S04: React.FC = () => (
  <Slide title="BNF-подібна нотація">
    <Lead>
      Граматика задає форму коректних λ-термів. Символ <M>::=</M> читається як «може мати форму», а вертикальна риска <M>|</M> означає
      «або».
    </Lead>
    <Code
      x={96}
      y={330}
      size={56}
      step={1}
      stagger={8}
      code={`
        M ::= x
            | λx.M
            | M N
      `}
    />
    <At x={760} y={344} w={1060} step={2} size={34} weight={600}>
      <M c={C.amber}>::=</M> – «може мати форму»
    </At>
    <At x={760} y={428} w={1060} step={2} delay={10} size={34} weight={600}>
      <M c={C.amber}>|</M> – «або»: ще одна можлива форма
    </At>
    <At x={96} y={600} step={3} size={30} weight={600} color={C.dim}>
      виведення терма <M>λx. x y</M> за граматикою:
    </At>
    <Code
      x={96}
      y={650}
      size={40}
      step={3}
      delay={10}
      stagger={14}
      code={`
        M
        → λx. M        -- абстракція
        → λx. M N      -- аплікація
        → λx. x y      -- змінні
      `}
    />
  </Slide>
);

/* 5 · Абстракція і аплікація */
const S05: React.FC = () => {
  const SZ = 64;
  const col = (c: number) => 96 + c * CH * SZ;
  return (
    <Slide title="Абстракція і аплікація">
      <Lead>
        <A>Абстракція</A> задає функцію з параметром і тілом. <A>Аплікація</A> застосовує один терм до іншого як функцію до аргументу.
      </Lead>
      <Code x={96} y={330} size={SZ} step={1} code={`λx. x * x`} />
      <Under cx={col(1)} y={428} w={80} step={1} delay={14} color={C.accentHi}>
        параметр
      </Under>
      <Under cx={col(6.5)} y={428} w={200} step={1} delay={22} color={C.mint}>
        тіло
      </Under>
      <Code
        x={96}
        y={560}
        size={52}
        step={2}
        code={`
          (λx. x * x) [[2@20|5]]
          @3 →β 5 * 5
          @3+20 →β [[3@40|25]]
        `}
      />
      <At x={620} y={566} step={2} delay={24} size={30} weight={400} color={C.dim}>
        ← аргумент
      </At>
      <At x={96} y={860} w={1720} step={4} size={38}>
        У λ-численні сама функція може бути <A>без імені</A>. Ім’я не є частиною функції; важливими є параметр, тіло і застосування.
      </At>
    </Slide>
  );
};

/* 6 · Вільні й зв’язані змінні */
const ROWS: { term: string; binder: number; bound: number[]; free: number[]; note: React.ReactNode }[] = [
  { term: "λx. x", binder: 1, bound: [4], free: [], note: <><M c={C.mint}>x</M> – зв’язана</> },
  { term: "λx. x y", binder: 1, bound: [4], free: [6], note: <><M c={C.mint}>x</M> – зв’язана, <M c={C.amber}>y</M> – вільна</> },
  {
    term: "(λx. x) y",
    binder: 2,
    bound: [5],
    free: [8],
    note: <><M c={C.mint}>x</M> – зв’язана, <M c={C.amber}>y</M> – вільна: вона поза дією λx</>,
  },
];

const S06: React.FC = () => {
  const { s } = useSteps();
  const SZ = 56;
  return (
    <Slide title="Вільні й зв’язані змінні">
      <Lead>
        <A>Зв’язане</A> входження змінної перебуває під дією відповідної λ-абстракції. <A>Вільна</A> змінна не має зв’язувача всередині
        поточного терма.
      </Lead>
      {ROWS.map((r, i) => {
        const y = 400 + i * 150;
        const step = i + 1;
        const parts = r.term.split("").map((ch, k) => ({
          t: ch,
          c: k === r.binder ? C.accentHi : r.bound.includes(k) ? C.mint : r.free.includes(k) ? C.amber : C.dim,
        }));
        return (
          <React.Fragment key={i}>
            <Term x={96} y={y} size={SZ} parts={parts} step={step} />
            {r.bound.map((b) => (
              <BindArc key={b} x={96} y={y} size={SZ} a={b} b={r.binder} color={C.mint} p={s(step, 14)} />
            ))}
            <At x={760} y={y + 10} w={1060} step={step} delay={20} size={34} weight={600}>
              {r.note}
            </At>
          </React.Fragment>
        );
      })}
      <At x={96} y={860} w={1720} step={4} size={36}>
        У <M>λx. x y</M> змінна x зв’язана, а y вільна. Це важливо для <A>правильної підстановки</A> під час редукції.
      </At>
    </Slide>
  );
};

/* 7 · α-конверсія */
const S07: React.FC = () => (
  <Slide title="α-конверсія: перейменування">
    <Lead>
      <A>α-конверсія</A> змінює ім’я зв’язаної змінної без зміни змісту терма. Вона потрібна, щоб уникати конфліктів імен перед
      підстановкою.
    </Lead>
    <Term x={96} y={350} size={56} step={1} parts={[{ t: "λx. x", c: C.mint }]} />
    <At x={420} y={350} step={1} delay={8} size={56} weight={700} font={F.mono}>
      <Rel op="≡" sub="α" />
    </At>
    <Term
      x={560}
      y={350}
      size={56}
      step={1}
      delay={10}
      parts={[
        { t: "λ", c: C.mint },
        { t: "x", c: C.mint, to: "z", at: [1, 30] },
        { t: ". ", c: C.mint },
        { t: "x", c: C.mint, to: "z", at: [1, 30] },
      ]}
    />
    <Term x={96} y={490} size={56} step={2} parts={[{ t: "λx. λy. x", c: C.mint }]} />
    <At x={520} y={490} step={2} delay={8} size={56} weight={700} font={F.mono}>
      <Rel op="≡" sub="α" />
    </At>
    <Term
      x={660}
      y={490}
      size={56}
      step={2}
      delay={10}
      parts={[
        { t: "λ", c: C.mint },
        { t: "x", c: C.mint, to: "a", at: [2, 30] },
        { t: ". λ", c: C.mint },
        { t: "y", c: C.mint, to: "b", at: [2, 40] },
        { t: ". ", c: C.mint },
        { t: "x", c: C.mint, to: "a", at: [2, 30] },
      ]}
    />
    <At x={96} y={640} w={1720} step={3} size={36}>
      Перейменовувати можна лише <A>зв’язану</A> змінну. Вільні змінні не можна випадково зробити зв’язаними:
    </At>
    <Term x={96} y={730} size={48} step={3} delay={16} parts={[{ t: "λx. x " , c: C.mint }, { t: "y", c: C.amber }]} />
    <At x={420} y={732} step={3} delay={22} size={48} weight={700} font={F.mono}>
      <Rel op="≠" sub="α" color={C.red} />
    </At>
    <Term x={540} y={730} size={48} step={3} delay={26} parts={[{ t: "λy. y ", c: C.mint }, { t: "y", c: C.red }]} />
    <Mark ok={false} step={3} delay={36} x={880} y={736} size={48} />
    <At x={960} y={742} w={860} step={3} delay={40} size={30} weight={400} color={C.dim}>
      перейменування <M>x → y</M> захопило б вільну <M c={C.amber}>y</M>
    </At>
  </Slide>
);

export const t1Slides: SlideDef[] = [
  { id: "terms", title: "Мова термів", steps: [40, 60, 70], C: S03 },
  { id: "bnf", title: "BNF", steps: [40, 50, 50, 80], C: S04 },
];
export const t2Slides: SlideDef[] = [
  { id: "abs-app", title: "Абстракція і аплікація", steps: [40, 50, 50, 60, 55], C: S05 },
  { id: "free-bound", title: "Вільні й зв’язані", steps: [40, 55, 55, 55, 55], C: S06 },
];
export const t3Slides: SlideDef[] = [{ id: "alpha", title: "α-конверсія", steps: [40, 70, 70, 80], C: S07 }];
