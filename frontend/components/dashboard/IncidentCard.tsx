import {
    getCategoryLabel,
    getSeverityStyles,
    RawEvent,
} from "./EventCard";

export type Incident = {
    id: number;
    title: string;
    summary: string;
    severity: "low" | "medium" | "high";
    status: "active" | "monitoring" | "resolved";
    affected_area: string;
    recommended_action: string;
    evidence_event_ids: number[];
};

type IncidentCardProps = {
    incident: Incident;
    events: RawEvent[];
};

function getEvidenceEvents(incident: Incident, events: RawEvent[]) {
  return events.filter((event) =>
    incident.evidence_event_ids.includes(event.id)
  );
}

export default function IncidentCard({ incident, events }: IncidentCardProps) {
  const evidenceEvents = getEvidenceEvents(incident, events);

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl shadow-black/30">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
            Generated Incident
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${getSeverityStyles(
              incident.severity
            )}`}
          >
            {incident.severity.toUpperCase()}
          </span>
        </div>

        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {incident.title}
        </h3>

        <p className="mb-6 max-w-4xl text-sm leading-6 text-slate-300">
          {incident.summary}
        </p>

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Affected Area
            </p>
            <p className="mt-1 font-medium text-slate-100">
              {incident.affected_area}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Status
            </p>
            <p className="mt-1 font-medium text-slate-100">
              {incident.status}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Evidence
            </p>
            <p className="mt-1 font-medium text-slate-100">
              {evidenceEvents.length} raw events
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
          <p className="mb-2 text-sm font-semibold text-cyan-200">
            Recommended Action
          </p>
          <p className="text-sm leading-6 text-slate-300">
            {incident.recommended_action}
          </p>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-slate-200">
            Supporting Evidence
          </p>

          <div className="grid gap-3">
            {evidenceEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-slate-100">
                    #{event.id} · {event.title}
                  </p>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                    {getCategoryLabel(event.category)}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {event.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}