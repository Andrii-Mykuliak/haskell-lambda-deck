import React from "react";
import { C, F } from "../deck/theme";
import { mix, useSteps } from "../deck/steps";
import { clamp01 } from "./common";

export const CH = 0.6;

export type Part = { t: string; c?: string; to?: string; at?: [number, number]; bg?: [number, number, string] };

/** A monospace term built from parts; a part with `to` morphs into new text at step `at`. */
export const Term: React.FC<{ x: number; y: number; size: number; parts: Part[]; step?: number; delay?: number }> = ({
  x,
  y,
  size,
  parts,
  step = 0,
  delay = 0,
}) => {
  const { s } = useSteps();
  const p = s(step, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.3,
        whiteSpace: "pre",
        fontVariantLigatures: "none",
        color: C.mint,
        opacity: clamp01(p),
        transform: `translateX(${(1 - p) * -24}px)`,
      }}
    >
      {parts.map((pt, i) => {
        const hi = pt.bg ? clamp01(s(pt.bg[0], pt.bg[1])) : 0;
        const bgStyle: React.CSSProperties = pt.bg
          ? { borderRadius: 8, background: `${pt.bg[2]}${Math.round(hi * 0x40).toString(16).padStart(2, "0")}` }
          : {};
        if (pt.to === undefined || !pt.at) {
          return (
            <span key={i} style={{ color: pt.c, ...bgStyle }}>
              {pt.t}
            </span>
          );
        }
        const m = clamp01(s(pt.at[0], pt.at[1]));
        const w = mix(pt.t.length, pt.to.length, m) * CH * size;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", width: w, height: size * 1.3, verticalAlign: "top", ...bgStyle }}>
            <span style={{ position: "absolute", left: 0, top: 0, color: pt.c, opacity: 1 - m, transform: `translateY(${-m * size * 0.4}px)` }}>{pt.t}</span>
            <span style={{ position: "absolute", left: 0, top: 0, color: C.amber, opacity: m, transform: `translateY(${(1 - m) * size * 0.4}px)` }}>
              {pt.to}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** An arc above a monospace line from column `a` to column `b` (binding arrow). */
export const BindArc: React.FC<{ x: number; y: number; size: number; a: number; b: number; color: string; p: number; h?: number }> = ({
  x,
  y,
  size,
  a,
  b,
  color,
  p,
  h = 46,
}) => {
  const w = CH * size;
  const x1 = x + (a + 0.5) * w;
  const x2 = x + (b + 0.5) * w;
  const top = y + size * 0.12;
  const len = Math.abs(x2 - x1) + h * 1.6;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }}>
      <path
        d={`M ${x1} ${top} C ${x1} ${top - h}, ${x2} ${top - h}, ${x2} ${top}`}
        stroke={color}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - clamp01(p))}
      />
      <circle cx={x2} cy={top} r={5} fill={color} opacity={clamp01(p * 3 - 2)} />
    </svg>
  );
};

/** "≡α", "→β", "→η" with a subscript letter. */
export const Rel: React.FC<{ op: string; sub: string; color?: string }> = ({ op, sub, color = C.dim }) => (
  <span style={{ color, whiteSpace: "nowrap" }}>
    {op}
    <span style={{ fontSize: "0.6em", verticalAlign: "-0.25em" }}>{sub}</span>
  </span>
);
