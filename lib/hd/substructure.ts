import { GATE_ORDER, normalizeLongitude } from "@/lib/hd/gates";

export type Substructure = {
  gate: number;
  line: number;
  color: number;
  tone: number;
  base: number;
};

export function substructureFromEclipticLongitude(longitudeDegrees: number): Substructure {
  let signDegrees = normalizeLongitude(longitudeDegrees);
  signDegrees += 58;
  if (signDegrees >= 360) {
    signDegrees -= 360;
  }

  const percentageThrough = signDegrees / 360;
  const gate = GATE_ORDER[Math.floor(percentageThrough * 64)];

  const exactLine = 384 * percentageThrough;
  const line = (Math.floor(exactLine) % 6) + 1;

  const exactColor = 2304 * percentageThrough;
  const color = (Math.floor(exactColor) % 6) + 1;

  const exactTone = 13824 * percentageThrough;
  const tone = (Math.floor(exactTone) % 6) + 1;

  const exactBase = 69120 * percentageThrough;
  const base = (Math.floor(exactBase) % 5) + 1;

  return { gate, line, color, tone, base };
}

export function pickSideFromTone(tone: number): "left" | "right" {
  return tone <= 3 ? "left" : "right";
}
