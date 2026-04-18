import type { TeamReport } from "@/lib/bg5/types";

function toBase64Url(input: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(input, "utf-8").toString("base64url");
  }
  const utf8Bytes = encodeURIComponent(input).replace(
    /%([0-9A-F]{2})/g,
    (_, p1: string) => String.fromCharCode(parseInt(p1, 16)),
  );
  const base64 = window.btoa(utf8Bytes);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(input, "base64url").toString("utf-8");
  }
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = window.atob(padded);
  const encoded = Array.from(binary)
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");
  return decodeURIComponent(encoded);
}

export function encodeReport(report: TeamReport): string {
  return toBase64Url(JSON.stringify(report));
}

export function decodeReport(value: string): TeamReport | null {
  try {
    const json = fromBase64Url(value);
    return JSON.parse(json) as TeamReport;
  } catch {
    return null;
  }
}
