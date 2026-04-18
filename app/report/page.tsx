import Link from "next/link";
import { decodeReport } from "@/lib/bg5/codec";

type ReportPageProps = {
  searchParams: Promise<{ r?: string }>;
};

function ListBlock({ title, items }: { title: string; items: string[] }) {
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

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams;
  const report = params.r ? decodeReport(params.r) : null;

  if (!report) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold">Report non disponibile</h1>
        <p className="text-sm text-slate-600">
          Torna alla home e genera un nuovo report BG5 con i dati del team.
        </p>
        <Link className="text-sm font-semibold text-blue-700 underline" href="/">
          Vai alla schermata iniziale
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-10 text-slate-900">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">BG5 Team Report</p>
        <h1 className="text-3xl font-semibold">Panoramica Team</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Lettura orientata al lavoro su dynamics, leverage e possibili leaks nel team.
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Modalita: {report.reportMode === "advanced" ? "Advanced BG5" : "Professional"}
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        {report.members.map((member, index) => (
          <article key={member.input.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{member.input.name}</h2>
            <p className="text-sm text-slate-600">
              {member.input.role ? `${member.input.role} - ` : ""}
              {member.input.resolvedPlace ?? member.input.birthPlace}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Motivation {member.variables.motivation.colorLabel} ({member.variables.motivation.value}) - View{" "}
              {member.variables.view.colorLabel} ({member.variables.view.value})
            </p>
            <p className="mt-2 text-sm text-slate-700">{member.flow}</p>
            <Link
              href={`/report/member/${index}?r=${params.r}`}
              className="mt-3 inline-block text-sm font-semibold text-blue-700 underline"
            >
              Apri pagina membro
            </Link>
          </article>
        ))}
      </section>

      <ListBlock title="Team Potential" items={report.teamPotential} />
      <ListBlock title="Potential Frictions" items={report.teamFrictions} />
      <ListBlock title="Leverage Moves" items={report.leverageMoves} />
      <ListBlock title="Leaks" items={report.leakAreas} />

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Team Dynamics</h2>
        <p className="mt-2 text-sm text-slate-700">{report.bestEnvironmentMix}</p>
        <p className="mt-2 text-sm text-slate-700">{report.collaborationModel}</p>
      </section>
    </main>
  );
}
