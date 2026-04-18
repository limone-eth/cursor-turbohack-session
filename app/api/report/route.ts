import { encodeReport } from "@/lib/bg5/codec";
import { buildTeamReport } from "@/lib/bg5/engine";
import { geocodePlace } from "@/lib/geo/openmeteo";
import type { ReportMode, TeamMemberInput } from "@/lib/bg5/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportRequest = {
  members: TeamMemberInput[];
  reportMode?: ReportMode;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ReportRequest;
  if (!body.members || body.members.length < 3 || body.members.length > 5) {
    return Response.json({ error: "Servono tra 3 e 5 membri." }, { status: 400 });
  }

  const reportMode: ReportMode = body.reportMode === "advanced" ? "advanced" : "professional";

  const enriched: TeamMemberInput[] = [];
  for (const member of body.members) {
    const geo = await geocodePlace(member.birthPlace);
    enriched.push({
      ...member,
      resolvedPlace: geo.name,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
    });
  }

  const report = await buildTeamReport(enriched, reportMode);
  const encoded = encodeReport(report);
  return Response.json({ report, encoded, reportMode });
}
