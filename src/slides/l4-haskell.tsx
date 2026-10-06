import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, HaskellLogo, Lead, M, Slide } from "../deck/ui";
import { Cell } from "./common";
import { Term } from "./term";

/* 16 · Перехід до Haskell */
const S16: React.FC = () => (
  <Slide title="Перехід до Haskell">
    <Lead>
      Haskell не є чистим λ-численням, але його функційний синтаксис напряму використовує ті самі ідеї: абстракцію, аплікацію і
      підстановкове міркування.
    </Lead>
    <At x={96} y={340} step={1} size={30} weight={700} color={C.accentHi}>
      λ-числення
    </At>
    <At x={900} y={340} step={1} size={30} weight={700} color={C.mint}>
      Haskell
    </At>
    {[
      { y: 410, step: 1, tail: " x + 1", wrap: false },
      { y: 540, step: 2, tail: " x + 1", wrap: true },
    ].map((r, i) => (
      <React.Fragment key={i}>
        <Term
          x={96}
          y={r.y}
          size={52}
          step={r.step}
          parts={[{ t: r.wrap ? "(λx." + r.tail + ") 5" : "λx." + r.tail, c: C.text }]}
        />
        <Arrow x1={660} y1={r.y + 34} x2={860} y2={r.y + 34} step={r.step} delay={12} dur={14} color={C.dim} />
        <Term
          x={900}
          y={r.y}
          size={52}
          step={r.step}
          delay={20}
          parts={[
            ...(r.wrap ? [{ t: "(", c: C.mint }] : []),
            { t: "λ", c: C.mint, to: "\\", at: [r.step, 44] as [number, number] },
            { t: "x", c: C.mint },
            { t: ".", c: C.mint, to: " ->", at: [r.step, 56] as [number, number] },
            { t: r.tail, c: C.mint },
            ...(r.wrap ? [{ t: ") 5", c: C.mint }] : []),
          ]}
        />
      </React.Fragment>
    ))}
    <Code x={900} y={640} size={40} step={2} delay={80} style={{ color: C.dim }} code={`-- 6`} />
    <At x={96} y={800} w={1720} step={3} size={38}>
      У Haskell символ <M>\</M> виконує роль <M>λ</M>, а аплікація функції до аргументу записується <A>пробілом</A>.
    </At>
  </Slide>
);

/* 17 · Каррування у Haskell */
const S17: React.FC = () => (
  <Slide title="Каррування у Haskell">
    <Lead>
      У Haskell функція кількох аргументів фактично є послідовністю функцій одного аргументу. Стрілка типу <A>асоціюється вправо</A>.
    </Lead>
    <Code
      x={96}
      y={330}
      size={46}
      step={1}
      stagger={8}
      code={`
        add :: Int -> Int -> Int
        add x y = x + y
        add = \\x -> (\\y -> x + y)
      `}
    />
    <Code x={96} y={570} size={50} step={2} code={`add 2 3  ≡  [[+2@20|(]]add 2[[+2@20|)]] 3`} />
    <At x={96} y={680} w={1720} step={3} size={36} weight={600}>
      Після <M>add 2</M> отримуємо функцію <M c={C.amber}>Int -&gt; Int</M>:
    </At>
    <Code x={96} y={740} size={44} step={3} delay={14} code={`Int -> Int -> Int  ≡  Int -> [[+3@40|(]]Int -> Int[[+3@40|)]]`} />
    <At x={96} y={880} w={1720} step={4} size={36}>
      Це не технічна деталь синтаксису, а <A>наслідок моделі аплікації</A>.
    </At>
  </Slide>
);

/* 18 · Часткове застосування */
const S18: React.FC = () => {
  const { s } = useSteps();
  const X0 = 1000;
  const P = 130;
  return (
    <Slide title="Часткове застосування">
      <Lead>
        <A>Часткове застосування</A> – застосування каррованої функції не до всіх аргументів. Результатом є нова функція, яка очікує
        решту аргументів.
      </Lead>
      <Code
        x={96}
        y={340}
        size={46}
        step={1}
        stagger={10}
        code={`
          add10 = add 10
          add10 7        -- 17
        `}
      />
      <Code
        x={96}
        y={540}
        size={46}
        step={2}
        code={`
          map (add 10) [1,2,3]
          @2+70 -- [11,12,13]
        `}
      />
      {[1, 2, 3].map((v, i) => (
        <React.Fragment key={i}>
          <Cell x={X0 + i * P} y={520} w={100} label={v} color={C.lav} appear={s(2, 6 + i * 4, POP)} />
          <Arrow x1={X0 + i * P + 50} y1={594} x2={X0 + i * P + 50} y2={644} step={2} delay={24 + i * 8} dur={10} color={C.dim} width={3} />
          <Cell x={X0 + i * P} y={654} w={100} label={v + 10} appear={s(2, 30 + i * 8, POP)} force={s(2, 34 + i * 8)} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: X0 + 3 * P + 10, top: 600 }}>
        <Chip size={28} color={C.amber} border={C.amber}>
          add 10
        </Chip>
      </div>
      <At x={96} y={840} w={1720} step={3} size={36}>
        <M>add 10</M> – це повноцінне <A>функційне значення</A>. Воно може бути збережене, передане як аргумент або використане у
        композиції.
      </At>
    </Slide>
  );
};

/* 19 · Аплікація і композиція у Haskell */
const FORMS: { code: string; res: number; note: React.ReactNode }[] = [
  { code: "square (2 + 3)", res: 25, note: <>звичайна аплікація з дужками</> },
  { code: "square $ 2 + 3", res: 25, note: <><M>$</M> допомагає прибрати дужки праворуч</> },
  { code: "5 & square", res: 25, note: <><M>&amp;</M> читає перетворення зліва направо</> },
  { code: "(double . square) 5", res: 50, note: <><M>.</M> не застосовує функцію, а будує нову</> },
];

const S19: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Аплікація і композиція у Haskell">
      <Lead>
        <A>Аплікація</A> застосовує функцію до значення. <A>Композиція</A> створює нову функцію з двох функцій.
      </Lead>
      {FORMS.map((f, i) => {
        const y = 330 + i * 120;
        return (
          <React.Fragment key={i}>
            <Code x={96} y={y} size={44} step={i + 1} code={f.code} />
            <Arrow x1={640} y1={y + 32} x2={720} y2={y + 32} step={i + 1} delay={12} dur={8} color={C.dim} width={3} />
            <Cell x={740} y={y} w={100} label={f.res} appear={s(i + 1, 18, POP)} />
            <At x={900} y={y + 10} w={920} step={i + 1} delay={22} size={32} weight={600}>
              {f.note}
            </At>
          </React.Fragment>
        );
      })}
      <At x={96} y={830} w={1720} step={4} delay={40} size={28} weight={400} color={C.dim}>
        <M>square x = x * x</M>, <M>double x = x * 2</M>; оператор <M>&amp;</M> імпортується з <M>Data.Function</M>
      </At>
    </Slide>
  );
};

/* 20 · Асоціативність у Haskell */
const ASSOC: { code: string; dir: "left" | "right"; label: string }[] = [
  { code: "f a b  ≡  [[+N@24|(]]f a[[+N@24|)]] b", dir: "left", label: "аплікація: вліво" },
  { code: "Int -> Int -> Int  ≡  Int -> [[+N@24|(]]Int -> Int[[+N@24|)]]", dir: "right", label: "стрілка типу: вправо" },
  { code: "f . g . h  ≡  f . [[+N@24|(]]g . h[[+N@24|)]]", dir: "right", label: "композиція: вправо" },
];

const S20: React.FC = () => (
  <Slide title="Асоціативність у Haskell">
    <Lead>
      <A>Асоціативність</A> визначає, як групується вираз без дужок. Це допомагає правильно читати типи, аплікації та оператори.
    </Lead>
    {ASSOC.map((r, i) => {
      const y = 340 + i * 120;
      return (
        <React.Fragment key={i}>
          <Code x={96} y={y} size={44} step={i + 1} code={r.code.split("N").join(String(i + 1))} />
          <At x={1340} y={y + 2} step={i + 1} delay={30} dir={r.dir === "left" ? "right" : "left"} pop>
            <Chip size={30} color={r.dir === "left" ? C.lav : C.amber} border={r.dir === "left" ? C.lav : C.amber}>
              {r.dir === "left" ? `← ${r.label}` : `${r.label} →`}
            </Chip>
          </At>
        </React.Fragment>
      );
    })}
    <At x={96} y={720} w={1720} step={4} size={34}>
      Аплікація функції асоціюється <A>вліво</A>. Стрілка типу та композиція – <A>вправо</A>. Якщо є сумнів, став дужки явно.
    </At>
    <At x={96} y={850} w={1720} step={5} size={32} weight={400} color={C.dim}>
      Практичне правило: спочатку згрупуй вираз, а вже потім читай його значення чи тип. Для коду це часто важливіше за саме означення.
    </At>
  </Slide>
);

/* 21 · Підсумок */
const POINTS = [
  "λ-терми будуються зі змінних, абстракцій і аплікацій",
  "α-конверсія перейменовує зв’язані змінні без зміни змісту",
  "β-редукція пояснює застосування функції як підстановку",
  "η-редукція прибирає зайву функційну обгортку",
  "λ-числення, машина Тюрінга і рекурсивні функції мають еквівалентну обчислювальну силу",
  "існують задачі, для яких загального алгоритму не існує",
  "каррування Haskell пов’язане з послідовною аплікацією",
  "асоціативність підказує, як групуються аплікації, типи й оператори",
];

const S21: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <div style={{ position: "absolute", right: 90, top: 90, opacity: 0.22 * s(0, 10) }}>
        <HaskellLogo size={380} p1={s(0, 4, POP)} p2={s(0, 10, POP)} p3={s(0, 16, POP)} />
      </div>
      <At x={130} y={150} step={0} delay={4} size={76} weight={800} font={F.head}>
        Підсумок
      </At>
      {POINTS.map((p, i) => (
        <At key={i} x={170} y={290 + i * 84} w={1680} step={0} delay={16 + i * 8} size={34} weight={600}>
          <A c={C.pink}>•</A> {p}
        </At>
      ))}
    </Slide>
  );
};

export const t6Slides: SlideDef[] = [
  { id: "to-haskell", title: "Перехід до Haskell", steps: [45, 90, 110, 55], C: S16 },
  { id: "currying", title: "Каррування", steps: [45, 55, 60, 70, 55], C: S17 },
];
export const t7Slides: SlideDef[] = [
  { id: "partial", title: "Часткове застосування", steps: [45, 50, 90, 55], C: S18 },
  { id: "app-comp", title: "Аплікація і композиція", steps: [45, 50, 50, 50, 80], C: S19 },
  { id: "assoc", title: "Асоціативність", steps: [45, 60, 60, 60, 55, 55], C: S20 },
];
export const summarySlide: SlideDef = { id: "summary", title: "Підсумок", steps: [110], C: S21 };
