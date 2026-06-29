"use client";

import { useState } from "react";
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

function getSeverityGlow(severity: Incident["severity"]) {
  if (severity === "high") {
    return "bg-red-500/20";
  }

  if (severity === "medium") {
    return "bg-yellow-500/20";
  }

  return "bg-green-500/20";
}

export default function IncidentCard({ incident, events }: IncidentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const evidenceEvents = getEvidenceEvents(incident, events);
  const firstEvidence = evidenceEvents[0];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.065]">
      <div
        className={`absolute -right-14 -top-14 h-40 w-40 rounded-full blur-3xl ${getSeverityGlow(
          incident.severity
        )}`}
      />
      <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
              Generated Incident
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {incident.status}
            </span>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityStyles(
              incident.severity
            )}`}
          >
            {incident.severity.toUpperCase()}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-start">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              {incident.title}
            </h3>

            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-300">
              {incident.summary}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Area
              </p>
              <p className="mt-1 truncate font-medium text-slate-100">
                {incident.affected_area}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Evidence
              </p>
              <p className="mt-1 font-medium text-slate-100">
                {evidenceEvents.length} signals
              </p>
            </div>
          </div>
        </div>

        {firstEvidence && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Top supporting signal
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              #{firstEvidence.id} · {firstEvidence.title}
            </p>
            <p className="mt-1 line-clamp-1 text-sm text-slate-400">
              {firstEvidence.message}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            Recommendation available · Evidence-linked
          </p>

          <button
            onClick={() => setIsExpanded((currentValue) => !currentValue)}
            className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
          >
            {isExpanded ? "Hide details" : "View details"}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
              <p className="mb-2 text-sm font-semibold text-cyan-200">
                Recommended Action
              </p>
              <p className="text-sm leading-6 text-slate-300">
                {incident.recommended_action}
              </p>
            </div>

            <div>
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
        )}
      </div>
    </article>
  );
}