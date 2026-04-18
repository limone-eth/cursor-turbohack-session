"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReportMode, TeamMemberInput } from "@/lib/bg5/types";

const MIN_MEMBERS = 3;
const MAX_MEMBERS = 5;

function emptyMember(index: number): TeamMemberInput {
  return {
    name: "",
    role: index === 0 ? "Founder" : "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  };
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

  function validateInputs() {
    for (const [index, member] of members.entries()) {
      if (!member.name.trim()) return `Inserisci il nome per la persona ${index + 1}.`;
      if (!member.birthDate) return `Inserisci la data di nascita per ${member.name}.`;
      if (!member.birthTime) return `Inserisci l'ora di nascita per ${member.name}.`;
      if (!member.birthPlace.trim()) return `Inserisci il luogo di nascita per ${member.name}.`;
    }
    return "";
  }

  async function generateReport() {
    const validationError = validateInputs();
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
        body: JSON.stringify({ members, reportMode }),
      });

      const raw = await response.text();
      let payload: { encoded?: string; error?: string } = {};
      if (raw.trim()) {
        try {
          payload = JSON.parse(raw) as { encoded?: string; error?: string };
        } catch {
          throw new Error("Risposta del server non valida (non JSON).");
        }
      }

      if (!response.ok) {
        throw new Error(payload.error ?? `Errore HTTP ${response.status}.`);
      }
      if (!payload.encoded) {
        throw new Error(payload.error ?? "Risposta API vuota o senza dati codificati.");
      }

      router.push(`/report?r=${payload.encoded}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Errore sconosciuto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 text-slate-900">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          BG5 Team Compatibility
        </p>
        <h1 className="text-3xl font-semibold">Crea il Team Report (3-5 persone)</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Inserisci i dati anagrafici. Il sistema geocodifica il luogo, calcola il tema con Swiss Ephemeris, e genera
          un report in linguaggio BG5 (business-friendly).
        </p>
      </header>

      <section className="grid gap-4">
        {members.map((member, index) => (
          <article key={`member-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Team member {index + 1}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                Nome *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  value={member.name}
                  onChange={(event) => updateMember(index, "name", event.target.value)}
                  placeholder="Es. Andrea"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Ruolo (optional)
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  value={member.role}
                  onChange={(event) => updateMember(index, "role", event.target.value)}
                  placeholder="Es. Product Lead"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Data di nascita *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  type="date"
                  value={member.birthDate}
                  onChange={(event) => updateMember(index, "birthDate", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Ora di nascita *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  type="time"
                  value={member.birthTime}
                  onChange={(event) => updateMember(index, "birthTime", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm md:col-span-2">
                Luogo di nascita *
                <input
                  className="rounded-md border border-slate-300 px-3 py-2"
                  value={member.birthPlace}
                  onChange={(event) => updateMember(index, "birthPlace", event.target.value)}
                  placeholder="Es. Milano, Italia"
                />
              </label>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Modalita report</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reportMode"
              checked={reportMode === "professional"}
              onChange={() => setReportMode("professional")}
            />
            <span>Professional - linguaggio business semplice, immediato e operativo.</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reportMode"
              checked={reportMode === "advanced"}
              onChange={() => setReportMode("advanced")}
            />
            <span>Advanced BG5 - include dettagli tecnici aggiuntivi (gate/line/tone e segnali avanzati).</span>
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
          + Aggiungi persona
        </button>
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          onClick={removeMember}
          disabled={!canRemoveMember || loading}
          type="button"
        >
          - Rimuovi ultima persona
        </button>
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          onClick={() => void generateReport()}
          disabled={loading}
          type="button"
        >
          {loading ? "Calcolo in corso..." : "Genera report BG5"}
        </button>
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </main>
  );
}
