import "server-only";

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import SwissEPH from "@/lib/ephemeris/sweph";
import { localWallTimeToUtcParts } from "@/lib/geo/timezone";
import { normalizeLongitude } from "@/lib/hd/gates";

const require = createRequire(path.join(process.cwd(), "package.json"));

export type BirthContext = {
  julianDayUt: number;
  latitude: number;
  longitude: number;
};

type SwissEph = InstanceType<typeof SwissEPH>;

let cached: SwissEph | null = null;
let initPromise: Promise<SwissEph> | null = null;

export async function getSweph(): Promise<SwissEph> {
  if (cached) return cached;
  if (!initPromise) {
    initPromise = (async () => {
      const pkgDist = path.dirname(require.resolve("sweph-wasm"));
      const wasmPath = path.join(pkgDist, "wasm", "swisseph.wasm");
      const wasmBinary = fs.readFileSync(wasmPath);
      const loadWasm = require(path.join(pkgDist, "wasm", "swisseph.cjs")).default;
      const wasmModule = await loadWasm({ wasmBinary });
      const swe = new SwissEPH(wasmModule);
      await swe.swe_set_ephe_path();
      cached = swe;
      return swe;
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

export function zonedDateTimeToUtcParts(
  timeZone: string,
  birthDate: string,
  birthTime: string,
): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  return localWallTimeToUtcParts(timeZone, birthDate, birthTime);
}

export function utcPartsToJulianDayUt(
  swe: SwissEph,
  parts: ReturnType<typeof zonedDateTimeToUtcParts>,
): number {
  const [_, ut] = swe.swe_utc_to_jd(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    swe.SE_GREG_CAL,
  );
  return ut;
}

export function sunLongitudeUt(swe: SwissEph, julianDayUt: number): number {
  const pos = swe.swe_calc_ut(julianDayUt, 0, 0);
  return normalizeLongitude(pos[0]);
}

export function trueNodeLongitudeUt(swe: SwissEph, julianDayUt: number): number {
  const pos = swe.swe_calc_ut(julianDayUt, 11, 0);
  return normalizeLongitude(pos[0]);
}

export function oppositeLongitude(longitude: number): number {
  return normalizeLongitude(longitude + 180);
}

function longitudeDelta(from: number, to: number): number {
  return normalizeLongitude(to - from);
}

export function findDesignJulianDayUt(swe: SwissEph, birthJulianDayUt: number): number {
  const birthLon = sunLongitudeUt(swe, birthJulianDayUt);

  let previous = birthJulianDayUt;

  for (let day = 1; day <= 120; day += 1) {
    const candidate = birthJulianDayUt - day;
    const lon = sunLongitudeUt(swe, candidate);
    const delta = longitudeDelta(lon, birthLon);

    if (delta >= 88) {
      const refined = refineDesignJd(swe, candidate, previous, birthLon);
      return refined;
    }

    previous = candidate;
  }

  throw new Error("Could not derive design date (120-day search window was not enough).");
}

function refineDesignJd(swe: SwissEph, lowerJd: number, upperJd: number, birthLon: number): number {
  let low = lowerJd;
  let high = upperJd;

  for (let i = 0; i < 40; i += 1) {
    const mid = (low + high) / 2;
    const midLon = sunLongitudeUt(swe, mid);
    const delta = longitudeDelta(midLon, birthLon);

    if (delta >= 88) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}
