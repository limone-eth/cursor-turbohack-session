"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReportMode, TeamMemberInput } from "@/lib/bg5/types";

const MIN_MEMBERS = 3;
const MAX_MEMBERS = 5;

const SAMPLE_TEAM: TeamMemberInput[] = [
  {
    name: "Alex Chen",
    role: "Product",
    birthDate: "1990-05-15",
    birthTime: "09:30",
    birthPlace: "London, UK",
  },
  {
    name: "Sam Rivera",
    role: "Engineering",
    birthDate: "1988-11-03",
    birthTime: "14:15",
    birthPlace: "New York, USA",
  },
  {
    name: "Jordan Lee",
    role: "Design",
    birthDate: "1992-02-20",
    birthTime: "18:45",
    birthPlace: "Berlin, Germany",
  },
];

function emptyMember(index: number): TeamMemberInput {
  return {
    name: "",
    role: index === 0 ? "Founder" : "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  };
}

function validateTeam(team: TeamMemberInput[]): string {
  for (const [index, member] of team.entries()) {
    if (!member.name.trim()) return `Please enter a name for person ${index + 1}.`;
    if (!member.birthDate) return `Please enter a birth date for ${member.name || `person ${index + 1}`}.`;
    if (!member.birthTime) return `Please enter a birth time for ${member.name}.`;
    if (!member.birthPlace.trim()) return `Please enter a birth place for ${member.name}.`;
  }
  return "";
}

export default function Home() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMemberInput[]>([
    emptyMember(0),
    emptyMember(1),
    emptyMember(2),
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportMode, setReportMode] = useState<ReportMode>("professional");

  const canAddMember = useMemo(() => members.length < MAX_MEMBERS, [members.length]);
  const canRemoveMember = useMemo(() => members.length > MIN_MEMBERS, [members.length]);

  function updateMember(index: number, field: keyof TeamMemberInput, value: string) {
    setMembers((previous) =>
      previous.map((member, i) => (i === index ? { ...member, [field]: value } : member)),
    );
  }

  function addMember() {
    if (!canAddMember) return;
    setMembers((previous) => [...previous, emptyMember(previous.length)]);
  }

  function removeMember() {
    if (!canRemoveMember) return;
    setMembers((previous) => previous.slice(0, -1));
  }

  function fillSampleTeam() {
    setMembers(SAMPLE_TEAM.map((m) => ({ ...m })));
    setError("");
  }

  async function submitReport(team: TeamMemberInput[]) {
    const validationError = validateTeam(team);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: team, reportMode }),
      });

      const raw = await response.text();
      let payload: { encoded?: string; error?: string } = {};
      if (raw.trim()) {
        try {
          payload = JSON.parse(raw) as { encoded?: string; error?: string };
        } catch {
          throw new Error("Server returned invalid JSON.");
        }
      }

      if (!response.ok) {
        throw new Error(payload.error ?? `Request failed (${response.status}).`);
      }
      if (!payload.encoded) {
        throw new Error(payload.error ?? "Empty response: no encoded report.");
      }

      router.push(`/report?r=${payload.encoded}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    await submitReport(members);
  }

  async function quickTestSample() {
    const sample = SAMPLE_TEAM.map((m) => ({ ...m }));
    setMembers(sample);
    await submitReport(sample);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 text-slate-900">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">BG5 team compatibility</p>
        <h1 className="text-3xl font-semibold">Build a team report (3-5 people)</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Enter birth data. We geocode the place, compute the chart with Swiss Ephemeris, and generate a plain-English BG5-style
          career readout for the group.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950 hover:bg-amber-100 disabled:opacity-50"
            onClick={() => void quickTestSample()}
            disabled={loading}
          >
            Quick test (sample team + generate)
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            onClick={fillSampleTeam}
            disabled={loading}
          >
            Fill sample data only
          </button>
        </div>
      </header>

      <section className="grid gap-4">
        {members.map((member, index) => (
          <article key={`member-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Team member {index + 1}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                Name *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  value={member.name}
                  onChange={(event) => updateMember(index, "name", event.target.value)}
                  placeholder="e.g. Alex Chen"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Role (optional)
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  value={member.role}
                  onChange={(event) => updateMember(index, "role", event.target.value)}
                  placeholder="e.g. Product lead"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Birth date *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  type="date"
                  value={member.birthDate}
                  onChange={(event) => updateMember(index, "birthDate", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Birth time *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  type="time"
                  value={member.birthTime}
                  onChange={(event) => updateMember(index, "birthTime", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm md:col-span-2">
                Birth place *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  value={member.birthPlace}
                  onChange={(event) => updateMember(index, "birthPlace", event.target.value)}
                  placeholder="e.g. London, UK"
                />
              </label>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Report mode</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reportMode"
              checked={reportMode === "professional"}
              onChange={() => setReportMode("professional")}
            />
            <span>Professional: simpler language, fewer technical labels.</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reportMode"
              checked={reportMode === "advanced"}
              onChange={() => setReportMode("advanced")}
            />
            <span>Advanced: includes gate / line / tone detail for readers who want the full BG5 map.</span>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          onClick={addMember}
          disabled={!canAddMember || loading}
          type="button"
        >
          + Add person
        </button>
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          onClick={removeMember}
          disabled={!canRemoveMember || loading}
          type="button"
        >
          − Remove last person
        </button>
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          onClick={() => void generateReport()}
          disabled={loading}
          type="button"
        >
          {loading ? "Building report..." : "Generate report"}
        </button>
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </main>
  );
}
