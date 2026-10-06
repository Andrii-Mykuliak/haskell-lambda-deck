# Лекція 3 – Лямбда-числення і його застосування в Haskell (motion deck)

A step-by-step presentation built with Remotion. Each slide is a Remotion composition;
the browser app plays each step's animation and pauses until you click.

Live: https://andrii-mykuliak.github.io/haskell-lambda-deck/

## Run

```bash
npm install
npm run dev        # open the printed URL, press f for fullscreen
```

## Controls

| Key | Action |
|---|---|
| → / Space / PgDn / Enter / click | next step (the first press finishes a step that is still animating) |
| ← / PgUp / right-click | previous step (jumps, no reverse animation) |
| number + Enter | go to slide N |
| Home / End | first / last slide |
| r | replay the current step |
| f | fullscreen |
| h | slide / step counter |
| ? | help |
| l | laser pointer (red dot with a fading trail) |
| s | spotlight: dims everything except a circle around the cursor (mouse wheel changes its size) |
| d | pen: clicks draw instead of advancing; move with the keyboard or a clicker |
| m | highlighter: a thick stroke that fades after ~2 s |
| 1–4 | ink colour while the pen or highlighter is on (red, yellow, mint, white) |
| c | clear drawings (they also clear when the slide changes) |
| b / w | black / white screen |
| Esc | turn off every tool and screen |

The same tools are on the toolbar at the bottom of the screen (hover a button to see its shortcut).

The URL hash (`#12`) holds the current slide, so a reload returns to it.

## Editing

- `src/slides/*.tsx`: one file per lecture section. Each slide is a `SlideDef` with
  `steps: number[]`, the frame length of each step (30 fps). Step 0 plays automatically.
- Inside a slide, `useSteps()` returns `s(step, delay)` (a spring from 0 to 1) and `t(step)` (frames elapsed).
- `<Code>` highlights Haskell. Lines can reveal on their own step with `@n` / `@n+delay`, and inline
  markers exist: `[[n|x]]` highlight, `[[+n|x]]` grow in, `[[-n|x]]` strike, `[[.n|x]]` dim,
  `[[!n|x]]` error; add `@d` for a delay and `~d` to set how long a highlight lasts.
- `src/slides/common.tsx`: `<Cell>` is a list cell that starts as a dashed thunk (`?`) and turns
  into a value as its `force` goes from 0 to 1; most laziness animations are built from it.
- `npm run studio`: open every slide in Remotion Studio to scrub its frames.
- `npm run shots`: render a PNG of every step to `out/shots` (quick visual check).

## Source

Built from `Лекція_3.pptx` (slides 1-22). Added on top of the PPTX: the epigraph (Raúl Rojas,
«A Tutorial Introduction to the Lambda Calculus», 2015) with a step-by-step reduction of `AND TRUE FALSE`,
binding arcs for free and bound variables, animated α-renaming, β-substitution and variable capture, a small
Turing machine running the AND example, and a closing slide where Ω reduces to itself.
