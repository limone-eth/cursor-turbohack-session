import Link from "next/link";
import { decodeReport } from "@/lib/bg5/codec";

type MemberPageProps = {
  params: Promise<{ index: string }>;
  searchParams: Promise<{ r?: string }>;
};

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
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
        <h1 className="text-2xl font-semibold">Membro non disponibile</h1>
        <Link className="text-sm font-semibold text-blue-700 underline" href="/">
          Torna alla home
        </Link>
      </main>
    );
  }

  const member = report.members[index];
  const isAdvanced = report.reportMode === "advanced";
  const motivation = member.variables.motivation.value;
  const view = member.variables.view.value;
  const digestion = member.variables.digestion.value;
  const environment = member.variables.environment.value;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-10 text-slate-900">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">BG5 Individual Profile</p>
        <h1 className="text-3xl font-semibold">{member.input.name}</h1>
        <p className="text-sm text-slate-600">
          {member.input.role ? `${member.input.role} - ` : ""}
          Nato/a {member.input.birthDate} alle {member.input.birthTime},{" "}
          {member.input.resolvedPlace ?? member.input.birthPlace}
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Variables snapshot</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <strong>Motivation:</strong> {member.variables.motivation.colorLabel} ({motivation})
              {isAdvanced
                ? ` - tone ${member.variables.motivation.tone} - gate ${member.variables.motivation.gate}.${member.variables.motivation.line}`
                : ""}
            </li>
            <li>
              <strong>View:</strong> {member.variables.view.colorLabel} ({view})
              {isAdvanced
                ? ` - tone ${member.variables.view.tone} - gate ${member.variables.view.gate}.${member.variables.view.line}`
                : ""}
            </li>
            <li>
              <strong>Digestion:</strong> {member.variables.digestion.colorLabel} ({digestion})
              {isAdvanced
                ? ` - tone ${member.variables.digestion.tone} - gate ${member.variables.digestion.gate}.${member.variables.digestion.line}`
                : ""}
            </li>
            <li>
              <strong>Environment:</strong> {member.variables.environment.colorLabel} ({environment})
              {isAdvanced
                ? ` - tone ${member.variables.environment.tone} - gate ${member.variables.environment.gate}.${member.variables.environment.line}`
                : ""}
            </li>
          </ul>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Flow</h2>
          <p className="mt-2 text-sm text-slate-700">{member.flow}</p>
          <p className="mt-3 text-sm text-slate-700">{member.collaborationStyle}</p>
          <p className="mt-3 text-sm text-slate-700">{member.bestEnvironment}</p>
          {isAdvanced ? <p className="mt-3 text-xs text-slate-500">{member.calculationMethod}</p> : null}
        </article>
      </section>

      <Section title="Core Traits" items={member.traits} />
      <Section title="Top Skills" items={member.skills} />
      <Section title="General Skills" items={member.generalSkills} />
      <Section title="Best Practices to Work Together" items={member.bestPractices} />
      <Section title="Possible Frictions" items={member.possibleFrictions} />
      <Section title="How to Solve Frictions" items={member.frictionSolutions} />

      <Link className="text-sm font-semibold text-blue-700 underline" href={`/report?r=${query.r ?? ""}`}>
        Torna al report team
      </Link>
    </main>
  );
}
