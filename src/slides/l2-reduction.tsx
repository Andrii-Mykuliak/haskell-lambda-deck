import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Mark, Slide } from "../deck/ui";
import { clamp01, Num } from "./common";
import { BindArc, CH, Rel, Term } from "./term";

const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size, color = C.mint }) => (
  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: size, color, whiteSpace: "pre", fontVariantLigatures: "none" }}>{children}</span>
);

/* 8 · β-редукція: підстановка */
const S08: React.FC = () => {
  const { s } = useSteps();
  const SZ = 60;
  const W = CH * SZ;
  const fly = s(2, 6);
  const fx = mix(96 + 12 * W, 96 + 3 * W, fly);
  const fy = mix(360, 450, fly);
  return (
    <Slide title="β-редукція: підстановка">
      <Lead>
        <A>β-редекс</A> – підвираз вигляду <M>(λx.M) N</M>. β-редукція перетворює його на <M>M[x := N]</M>: аргумент N підставляється
        замість вільних входжень параметра x у тілі M.
      </Lead>
      <Term
        x={96}
        y={360}
        size={SZ}
        step={1}
        parts={[
          { t: "(λ", c: C.mint },
          { t: "x", c: C.accentHi },
          { t: ". ", c: C.mint },
          { t: "x", c: C.mint, bg: [2, 0, C.amber] },
          { t: " + 1) ", c: C.mint },
          { t: "5", c: C.amber },
        ]}
      />
      {fly > 0.01 && fly < 0.99 && (
        <div style={{ position: "absolute", left: fx, top: fy, fontFamily: F.mono, fontWeight: 700, fontSize: SZ, lineHeight: 1.3, color: C.amber }}>5</div>
      )}
      <Code
        x={96}
        y={450}
        size={SZ}
        step={2}
        lh={90}
        code={`
          @2+30 →β 5 + 1
          @2+56 →  [[2@70|6]]
        `}
      />
      <At x={760} y={372} w={1060} step={2} delay={10} size={30} weight={400} color={C.dim}>
        аргумент <M c={C.amber}>5</M> стає на місце <M c={C.accentHi}>x</M>
      </At>
      <At x={96} y={700} step={3} size={52} weight={600} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        <Mono color={C.text}>(λx.M) N</Mono> <Rel op="→" sub="β" color={C.amber} /> <Mono color={C.text}>M[x := N]</Mono>
      </At>
      <At x={96} y={860} w={1720} step={4} size={36}>
        Тут редексом є весь вираз <M>(λx. x + 1) 5</M>. Після підстановки параметр <M c={C.accentHi}>x</M> замінюється аргументом{" "}
        <M c={C.amber}>5</M>.
      </At>
    </Slide>
  );
};

/* 9 · β-редукція з кількома аргументами */
const S09: React.FC = () => (
  <Slide title="β-редукція з кількома аргументами">
    <Lead>
      Функція двох аргументів у λ-численні подається як функція, що повертає іншу функцію. Кожна аплікація обробляє <A>лише один</A>{" "}
      аргумент.
    </Lead>
    <Code
      x={96}
      y={340}
      size={52}
      step={1}
      lh={84}
      code={`
        @1 ([[1@10|(λx. λy. x + y) 2]]) 3
        @2 →β [[2@10|(λy. 2 + y) 3]]
        @3 →β 2 + 3
        @3+24 →  [[3@44|5]]
      `}
    />
    <At x={1000} y={436} w={820} step={2} delay={20} size={32} weight={600}>
      результат першого кроку –
      <br />
      <A>нова функція</A> <span style={{ whiteSpace: "nowrap" }}><M>λy. 2 + y</M></span>
    </At>
    <At x={96} y={860} w={1720} step={4} size={36}>
      Після першої β-редукції результатом є нова функція <M>λy. 2 + y</M>. Це математична основа <A>каррування</A>.
    </At>
  </Slide>
);

/* 10 · Захоплення змінної */
const S10: React.FC = () => {
  const { s } = useSteps();
  const SZ = 46;
  const naive = "(λy. x)[x := y] = λy. y";
  return (
    <Slide title="Захоплення змінної">
      <Lead>
        <A>Захоплення</A> виникає, коли вільна змінна аргументу після підстановки стає зв’язаною чужою λ-абстракцією.
      </Lead>
      <Term
        x={96}
        y={330}
        size={52}
        step={1}
        parts={[
          { t: "(λx. ", c: C.mint },
          { t: "λy", c: C.lav },
          { t: ". x) ", c: C.mint },
          { t: "y", c: C.amber },
        ]}
      />
      <At x={600} y={342} w={1220} step={1} delay={12} size={30} weight={400} color={C.dim}>
        аргумент <M c={C.amber}>y</M> – вільна змінна; усередині є свій параметр <M c={C.lav}>λy</M>
      </At>
      <At x={96} y={460} step={2} size={32} weight={700} color={C.red}>
        без α:
      </At>
      <Term
        x={250}
        y={452}
        size={SZ}
        step={2}
        delay={6}
        parts={naive.split("").map((ch, k) => ({ t: ch, c: k === 22 ? C.red : k === 19 || k === 2 ? C.lav : k === 13 ? C.amber : C.mint }))}
      />
      <BindArc x={250} y={452} size={SZ} a={22} b={19} color={C.red} p={s(2, 26)} h={40} />
      <Mark ok={false} step={2} delay={34} x={920} y={456} size={48} />
      <At x={990} y={462} w={830} step={2} delay={38} size={28} weight={400} color={C.dim}>
        вільна y стала зв’язаною
      </At>
      <At x={96} y={600} step={3} size={32} weight={700} color={C.mint}>
        з α:
      </At>
      <At x={250} y={592} step={3} delay={6} size={SZ} weight={700} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        <Mono>λy. x </Mono>
        <Rel op="≡" sub="α" />
        <Mono> λz. x</Mono>
      </At>
      <At x={250} y={672} step={3} delay={20} size={SZ} weight={700} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        <Mono>(λx. λz. x) </Mono>
        <Mono color={C.amber}>y</Mono>
        <Mono> </Mono>
        <Rel op="→" sub="β" color={C.amber} />
        <Mono> λz. </Mono>
        <Mono color={C.amber}>y</Mono>
      </At>
      <Mark ok step={3} delay={34} x={1000} y={680} size={48} />
      <At x={96} y={840} w={1720} step={4} size={34}>
        Внутрішній параметр y замінюємо на z, бо зовнішній аргумент теж має ім’я y. Після цього підстановка <A>не змінює статус</A> вільної
        змінної.
      </At>
    </Slide>
  );
};

/* 11 · η-редукція */
const ETA = [
  { title: "Правило", text: "якщо аргумент x просто передається у f, зовнішня функція є зайвою" },
  { title: "Умова", text: "x не повинен входити вільно у f; інакше скорочення змінить зміст терма" },
  { title: "Сенс", text: "обидва записи поводяться однаково для будь-якого аргументу" },
];

const S11: React.FC = () => (
  <Slide title="η-редукція: зайва обгортка">
    <Lead>
      <A>η-редукція</A> означає, що функцію, яка лише приймає аргумент і одразу передає його іншій функції, можна замінити цією іншою
      функцією.
    </Lead>
    {ETA.map((r, i) => (
      <React.Fragment key={i}>
        <At x={96} y={350 + i * 150} step={i + 1} dir="left" pop>
          <Num n={i + 1} size={48} />
        </At>
        <At x={180} y={342 + i * 150} w={720} step={i + 1} delay={6} size={34} weight={700}>
          {r.title}
        </At>
        <At x={180} y={390 + i * 150} w={720} step={i + 1} delay={10} size={27} weight={400} color={C.dim}>
          {r.text}
        </At>
      </React.Fragment>
    ))}
    <At x={1000} y={340} step={1} delay={14} size={52} weight={700} font={F.mono} style={{ fontVariantLigatures: "none" }}>
      <Mono>λx. f x </Mono>
      <Rel op="→" sub="η" color={C.amber} />
      <Mono> f</Mono>
    </At>
    <At x={1000} y={440} step={2} delay={14} size={34} weight={600} font={F.mono} style={{ fontVariantLigatures: "none" }}>
      <Mono color={C.dim}>бо: (λx. f x) a </Mono>
      <Rel op="→" sub="β" />
      <Mono color={C.dim}> f a</Mono>
    </At>
    <At x={1000} y={560} step={3} delay={10} size={30} weight={700} color={C.mint}>
      можна скоротити
    </At>
    <At x={1000} y={604} step={3} delay={14} size={40} weight={700} font={F.mono} style={{ fontVariantLigatures: "none" }}>
      <Mono>λx. f x </Mono>
      <Rel op="→" sub="η" color={C.amber} />
      <Mono> f</Mono>
    </At>
    <Mark ok step={3} delay={22} x={1460} y={604} size={46} />
    <At x={1000} y={700} step={3} delay={30} size={30} weight={700} color={C.red}>
      не можна скоротити так само
    </At>
    <At x={1000} y={744} step={3} delay={34} size={40} weight={700} font={F.mono} style={{ fontVariantLigatures: "none" }}>
      <Mono>λx. x f </Mono>
      <Rel op="≠" sub="η" color={C.red} />
      <Mono> x</Mono>
    </At>
    <Mark ok={false} step={3} delay={42} x={1460} y={744} size={46} />
    <At x={1000} y={812} w={820} step={3} delay={48} size={28} weight={400} color={C.dim}>
      тут x використовується як функція, а не просто передається у f
    </At>
  </Slide>
);

/* 12 · Нормальна форма */
const S12: React.FC = () => {
  const { s, t } = useSteps();
  const loops = Math.max(0, Math.min(3, Math.floor(t(2, 30) / 26) + 1));
  return (
    <Slide title="Нормальна форма">
      <Lead>
        <A>Редекс</A> – підвираз, до якого можна застосувати правило редукції. <A>Нормальна форма</A> – терм, у якому таких підвиразів
        більше немає.
      </Lead>
      <Code
        x={96}
        y={340}
        size={46}
        step={1}
        stagger={16}
        code={`
          [[1@6~18|(λx. x * x) 4]]
          →β 4 * 4
          →  [[1@44|16]]
        `}
      />
      <Mark ok step={1} delay={52} x={96} y={560} size={46} />
      <At x={160} y={566} step={1} delay={56} size={30} weight={600} color={C.mint}>
        нормальна форма: редексів немає
      </At>
      <Code x={980} y={340} size={40} step={2} code={`Ω = (λx. x x)(λx. x x)`} />
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 980,
            top: 420 + k * 60,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 36,
            color: C.mint,
            whiteSpace: "pre",
            fontVariantLigatures: "none",
            opacity: loops > k ? clamp01(s(2, 30 + k * 26)) : 0,
          }}
        >
          <Rel op="→" sub="β" color={C.red} />
          {k < 2 ? " (λx. x x)(λx. x x)" : " …"}
        </div>
      ))}
      <At x={980} y={620} w={840} step={2} delay={110} size={30} weight={600} color={C.red}>
        Ω відтворює сам себе: нормальної форми немає
      </At>
      <At x={96} y={840} w={1720} step={3} size={36}>
        Терм <M>16</M> уже не містить редексів. Натомість <M c={C.red}>Ω</M> знову відтворює сам себе, тому його редукція <A>не завершується</A>.
      </At>
    </Slide>
  );
};

export const t4Slides: SlideDef[] = [
  { id: "beta", title: "β-редукція", steps: [45, 50, 100, 55, 55], C: S08 },
  { id: "beta-multi", title: "β з кількома аргументами", steps: [45, 55, 55, 80, 55], C: S09 },
  { id: "capture", title: "Захоплення змінної", steps: [40, 60, 70, 70, 55], C: S10 },
];
export const t5aSlides: SlideDef[] = [
  { id: "eta", title: "η-редукція", steps: [45, 55, 55, 80], C: S11 },
  { id: "normal-form", title: "Нормальна форма", steps: [45, 80, 140, 55], C: S12 },
];
