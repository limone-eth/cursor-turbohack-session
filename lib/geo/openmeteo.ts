type GeocodeResult = {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export async function geocodePlace(query: string): Promise<GeocodeResult> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "it");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    results?: Array<{
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    }>;
  };

  const hit = payload.results?.[0];
  if (!hit || typeof hit.latitude !== "number" || typeof hit.longitude !== "number") {
    throw new Error("Luogo non trovato: prova con citta e paese (es. Milano, Italia).");
  }

  if (!hit.timezone) {
    throw new Error("Timezone non disponibile per questo luogo.");
  }

  const label = [hit.name, hit.admin1, hit.country].filter(Boolean).join(", ");

  return {
    name: label,
    latitude: hit.latitude,
    longitude: hit.longitude,
    timezone: hit.timezone,
  };
}
