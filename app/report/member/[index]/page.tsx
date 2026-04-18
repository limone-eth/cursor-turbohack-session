import Link from "next/link";
import { decodeReport } from "@/lib/bg5/codec";
import type { MemberReport, TeamReport } from "@/lib/bg5/types";
import { explainVariable } from "@/lib/bg5/variable-help";

type MemberPageProps = {
  params: Promise<{ index: string }>;
  searchParams: Promise<{ r?: string }>;
};

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {items.map((item, i) => (
          <li key={`${i}-${item.slice(0, 48)}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function VariablesExplained({ member, mode }: { member: MemberReport; mode: TeamReport["reportMode"] }) {
  const blocks = [
    { kind: "motivation" as const, detail: member.variables.motivation },
    { kind: "view" as const, detail: member.variables.view },
    { kind: "digestion" as const, detail: member.variables.digestion },
    { kind: "environment" as const, detail: member.variables.environment },
  ];

  return (
    <ul className="mt-3 space-y-4 text-sm text-slate-700">
      {blocks.map(({ kind, detail }) => {
        const { headline, meaning, inPractice } = explainVariable(kind, detail);
        return (
          <li key={kind} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="font-semibold text-slate-900">{headline}</p>
            <p className="mt-1 leading-relaxed">{meaning}</p>
            <p className="mt-2 text-slate-600">{inPractice}</p>
            {mode === "advanced" ? (
              <p className="mt-2 text-xs text-slate-500">
                Technical: gate {detail.gate}, line {detail.line}, tone {detail.tone}.
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default async function MemberPage({ params, searchParams }: MemberPageProps) {
  const routeParams = await params;
  const query = await searchParams;
  const report = query.r ? decodeReport(query.r) : null;
  const index = Number(routeParams.index);

  if (!report || Number.isNaN(index) || !report.members[index]) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold">Member not found</h1>
        <Link className="text-sm font-semibold text-blue-700 underline" href="/">
          Back to home
        </Link>
      </main>
    );
  }

  const member = report.members[index];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-10 text-slate-900">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">BG5 individual profile</p>
        <h1 className="text-3xl font-semibold">{member.input.name}</h1>
        <p className="text-sm text-slate-600">
          {member.input.role ? `${member.input.role} | ` : ""}
          Born {member.input.birthDate} at {member.input.birthTime} - {member.input.resolvedPlace ?? member.input.birthPlace}
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Career variables (explained)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Labels like Innocence or Survival are BG5 shorthand. Below is what they tend to mean day to day.
          </p>
          <VariablesExplained member={member} mode={report.reportMode} />
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Flow & collaboration</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{member.flow}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{member.collaborationStyle}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{member.bestEnvironment}</p>
          {report.reportMode === "advanced" ? (
            <p className="mt-3 text-xs text-slate-500">{member.calculationMethod}</p>
          ) : null}
        </article>
      </section>

      <Section title="Core traits" items={member.traits} />
      <Section title="Top skills" items={member.skills} />
      <Section title="General skills" items={member.generalSkills} />
      <Section title="Best practices to work together" items={member.bestPractices} />
      <Section title="Possible frictions" items={member.possibleFrictions} />
      <Section title="How to work through frictions" items={member.frictionSolutions} />

      <Link className="text-sm font-semibold text-blue-700 underline" href={`/report?r=${query.r ?? ""}`}>
        Back to team report
      </Link>
    </main>
  );
}
