import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { t1Slides, t2Slides, t3Slides } from "./l1-terms";
import { t4Slides, t5aSlides } from "./l2-reduction";
import { t5bSlides } from "./l3-models";
import { summarySlide, t6Slides, t7Slides } from "./l4-haskell";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...t1Slides,
  agendaSlide(1),
  ...t2Slides,
  agendaSlide(2),
  ...t3Slides,
  agendaSlide(3),
  ...t4Slides,
  agendaSlide(4),
  ...t5aSlides,
  ...t5bSlides,
  agendaSlide(5),
  ...t6Slides,
  agendaSlide(6),
  ...t7Slides,
  summarySlide,
  outroSlide,
];
