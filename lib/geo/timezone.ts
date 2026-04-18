function parseBirthParts(birthDate: string, birthTime: string) {
  const [y, m, d] = birthDate.split("-").map(Number);
  const [hh, mm] = birthTime.split(":").map(Number);
  return { y, m, d, hh, mm };
}

export function timeZoneOffsetHours(timeZone: string, birthDate: string, birthTime: string): number {
  const { y, m, d, hh, mm } = parseBirthParts(birthDate, birthTime);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const readParts = (instantMs: number) => {
    const parts = formatter.formatToParts(new Date(instantMs));
    const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
    return {
      y: read("year"),
      m: read("month"),
      d: read("day"),
      hh: read("hour"),
      mm: read("minute"),
      ss: read("second"),
    };
  };

  let guessMs = Date.UTC(y, m - 1, d, hh, mm, 0, 0);
  for (let pass = 0; pass < 2; pass += 1) {
    const z = readParts(guessMs);
    const actualMs = Date.UTC(z.y, z.m - 1, z.d, z.hh, z.mm, z.ss, 0);
    const desiredMs = Date.UTC(y, m - 1, d, hh, mm, 0, 0);
    guessMs += desiredMs - actualMs;
  }

  const zFinal = readParts(guessMs);
  const actualFinalMs = Date.UTC(zFinal.y, zFinal.m - 1, zFinal.d, zFinal.hh, zFinal.mm, zFinal.ss, 0);
  const desiredFinalMs = Date.UTC(y, m - 1, d, hh, mm, 0, 0);
  return (desiredFinalMs - actualFinalMs) / 3_600_000;
}

export function localWallTimeToUtcParts(
  timeZone: string,
  birthDate: string,
  birthTime: string,
): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const { y, m, d, hh, mm } = parseBirthParts(birthDate, birthTime);
  const offsetHours = timeZoneOffsetHours(timeZone, birthDate, birthTime);

  const localDecimalHours = hh + mm / 60;
  const utcDecimalHours = localDecimalHours - offsetHours;

  let day = d;
  let month = m;
  let year = y;

  let utcHours = utcDecimalHours;
  while (utcHours >= 24) {
    utcHours -= 24;
    day += 1;
  }
  while (utcHours < 0) {
    utcHours += 24;
    day -= 1;
  }

  const daysInMonth = (yearValue: number, monthValue: number) => new Date(Date.UTC(yearValue, monthValue, 0)).getUTCDate();

  while (day < 1) {
    month -= 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    day += daysInMonth(year, month);
  }

  while (day > daysInMonth(year, month)) {
    day -= daysInMonth(year, month);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  const hour = Math.floor(utcHours);
  const minute = Math.floor((utcHours - hour) * 60);
  const second = Math.round((((utcHours - hour) * 60 - minute) * 60 + Number.EPSILON) * 1000) / 1000;

  return { year, month, day, hour, minute, second };
}
