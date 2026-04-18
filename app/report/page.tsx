import Link from "next/link";
import { decodeReport } from "@/lib/bg5/codec";
import type { MemberReport, TeamReport } from "@/lib/bg5/types";
import { explainVariable } from "@/lib/bg5/variable-help";

type ReportPageProps = {
  searchParams: Promise<{ r?: string }>;
};

function ListBlock({ title, items }: { title: string; items: string[] }) {
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

function MemberVariableSummary({ member, mode }: { member: MemberReport; mode: TeamReport["reportMode"] }) {
  const blocks = [
    { kind: "motivation" as const, detail: member.variables.motivation },
    { kind: "view" as const, detail: member.variables.view },
    { kind: "digestion" as const, detail: member.variables.digestion },
    { kind: "environment" as const, detail: member.variables.environment },
  ];

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {blocks.map(({ kind, detail }) => {
        const { headline, meaning, inPractice } = explainVariable(kind, detail);
        return (
          <div key={kind} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">{headline}</p>
            <p className="mt-1 leading-relaxed text-slate-700">{meaning}</p>
            <p className="mt-2 text-slate-600">{inPractice}</p>
            {mode === "advanced" ? (
              <p className="mt-2 text-xs text-slate-500">
                Technical: gate {detail.gate}, line {detail.line}, tone {detail.tone} (color {detail.color}).
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams;
  const report = params.r ? decodeReport(params.r) : null;

  if (!report) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold">Report not available</h1>
        <p className="text-sm text-slate-600">Go back to the home page and generate a new team report.</p>
        <Link className="text-sm font-semibold text-blue-700 underline" href="/">
          Back to home
        </Link>
      </main>
    );
  }

  const frictionSupport = report.frictionSupport ?? [];
  const leakSupport = report.leakSupport ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-10 text-slate-900">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">BG5 team report</p>
        <h1 className="text-3xl font-semibold">Team overview</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Plain-language read on how this group may work together: what helps, what grates, and where energy can leak. Labels
          such as &quot;6 - Innocence&quot; are shorthand; each card below explains what they mean in real work terms.
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Mode: {report.reportMode === "advanced" ? "Advanced (includes technical gate/line/tone)" : "Professional"}
        </p>
        <Link className="inline-block text-sm font-semibold text-blue-700 underline" href="/">
          Back to home / new report
        </Link>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        {report.members.map((member, index) => (
          <article key={member.input.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{member.input.name}</h2>
            <p className="text-sm text-slate-600">
              {member.input.role ? `${member.input.role} | ` : ""}
              {member.input.resolvedPlace ?? member.input.birthPlace}
            </p>
            <MemberVariableSummary member={member} mode={report.reportMode} />
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{member.flow}</p>
            <Link
              href={`/report/member/${index}?r=${params.r}`}
              className="mt-3 inline-block text-sm font-semibold text-blue-700 underline"
            >
              Open full member page
            </Link>
          </article>
        ))}
      </section>

      <ListBlock title="Team strengths" items={report.teamPotential} />
      <ListBlock title="Where friction can show up" items={report.teamFrictions} />
      {frictionSupport.length > 0 ? (
        <ListBlock title="How to ease those frictions" items={frictionSupport} />
      ) : null}
      <ListBlock title="Leverage moves" items={report.leverageMoves} />
      <ListBlock title="Common energy leaks" items={report.leakAreas} />
      {leakSupport.length > 0 ? <ListBlock title="How to support / plug leaks" items={leakSupport} /> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Team dynamics</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{report.bestEnvironmentMix}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{report.collaborationModel}</p>
      </section>
    </main>
  );
}
