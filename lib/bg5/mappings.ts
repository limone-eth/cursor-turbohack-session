import type { ColorAxis } from "@/lib/bg5/types";

type ColorMap = Record<number, ColorAxis>;

export const MOTIVATION_BY_COLOR: ColorMap = {
  1: { left: "Communalist", right: "Separatist", colorLabel: "Fear" },
  2: { left: "Theist", right: "Antitheist", colorLabel: "Hope" },
  3: { left: "Leader", right: "Follower", colorLabel: "Desire" },
  4: { left: "Master", right: "Novice", colorLabel: "Need" },
  5: { left: "Conditioner", right: "Conditioned", colorLabel: "Guilt" },
  6: { left: "Observer", right: "Observed", colorLabel: "Innocence" },
};

export const VIEW_BY_COLOR: ColorMap = {
  1: { left: "Focused View", right: "Peripheral View", colorLabel: "Survival" },
  2: { left: "Focused View", right: "Peripheral View", colorLabel: "Possibility" },
  3: { left: "Focused View", right: "Peripheral View", colorLabel: "Power" },
  4: { left: "Focused View", right: "Peripheral View", colorLabel: "Wanting" },
  5: { left: "Focused View", right: "Peripheral View", colorLabel: "Probability" },
  6: { left: "Focused View", right: "Peripheral View", colorLabel: "Personal" },
};

export const DIGESTION_BY_COLOR: ColorMap = {
  1: { left: "Consecutive Appetite", right: "Alternating Appetite", colorLabel: "Appetite" },
  2: { left: "Open Taste", right: "Closed Taste", colorLabel: "Taste" },
  3: { left: "Hot Processing", right: "Cold Processing", colorLabel: "Thirst" },
  4: { left: "Calm Processing", right: "Nervous Processing", colorLabel: "Touch" },
  5: { left: "High Sound", right: "Low Sound", colorLabel: "Sound" },
  6: { left: "Direct Light", right: "Indirect Light", colorLabel: "Light" },
};

export const ENVIRONMENT_BY_COLOR: ColorMap = {
  1: { left: "Caves (Selective)", right: "Caves (Blending)", colorLabel: "Caves" },
  2: { left: "Markets (Internal)", right: "Markets (External)", colorLabel: "Markets" },
  3: { left: "Kitchens (Wet)", right: "Kitchens (Dry)", colorLabel: "Kitchens" },
  4: { left: "Mountains (Active)", right: "Mountains (Passive)", colorLabel: "Mountains" },
  5: { left: "Valleys (Narrow)", right: "Valleys (Wide)", colorLabel: "Valleys" },
  6: { left: "Shores (Natural)", right: "Shores (Artificial)", colorLabel: "Shores" },
};
