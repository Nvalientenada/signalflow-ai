"use client";
import {IncidentAnalysis} from "./dashboard/AIAnalysisPanel";

import { Dispatch, SetStateAction, useState } from "react";
import UserReportForm from "./UserReportForm";
import IncidentCard, { Incident } from "./dashboard/IncidentCard";
import EventCard, { RawEvent } from "./dashboard/EventCard";

import SignalPipeline from "./dashboard/SignalPipeline";

type CategoryFilter = RawEvent["category"] | "all";
type SeverityFilter = RawEvent["severity"] | "all";

type EventDashboardProps = {
  dashboardEvents: RawEvent[];
  dashboardIncidents: Incident[];
  dashboardAnalyses: IncidentAnalysis[];
  setDashboardEvents: Dispatch<SetStateAction<RawEvent[]>>;
  setDashboardIncidents: Dispatch<SetStateAction<Incident[]>>;
  setDashboardAnalyses: Dispatch<SetStateAction<IncidentAnalysis[]>>;
};

function getFilterButtonStyles(isActive: boolean) {
  if (isActive) {
    return "border-cyan-400 bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-500/10";
  }

  return "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white";
}

export default function EventDashboard({
  dashboardEvents,
  dashboardIncidents,
  dashboardAnalyses,
  setDashboardEvents,
  setDashboardIncidents,
  setDashboardAnalyses,
}: EventDashboardProps) {

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  const [selectedSeverity, setSelectedSeverity] =
    useState<SeverityFilter>("all");

  async function refreshIncidents() {
    try {
      const response = await fetch("http://127.0.0.1:8000/incidents", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const updatedIncidents: Incident[] = await response.json();

      setDashboardIncidents(updatedIncidents);
      refreshAnalyses();
    } catch {
      return;
    }
  }

  async function refreshAnalyses() {
    try {
        const response = await fetch("http://127.0.0.1:8000/incidents/analysis", {
        cache: "no-store",
        });

        if (!response.ok) {
        return;
        }

        const updatedAnalyses: IncidentAnalysis[] = await response.json();

        setDashboardAnalyses(updatedAnalyses); // updates the frontend state
    } catch {
        return;
    }
    }

  const filteredEvents = dashboardEvents.filter((event) => {
    const categoryMatches =
      selectedCategory === "all" || event.category === selectedCategory;

    const severityMatches =
      selectedSeverity === "all" || event.severity === selectedSeverity;

    return categoryMatches && severityMatches;
  });

  return (
    <div className="space-y-10">
        <SignalPipeline />

      <section id="reports">
        <UserReportForm
          onReportCreated={(newEvent) => {
            setDashboardEvents((currentEvents) => [newEvent, ...currentEvents]);
            setSelectedCategory("all");
            setSelectedSeverity("all");
            refreshIncidents();
          }}
        />
      </section>

      <section id="incidents">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Intelligence Layer
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Generated Incidents
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Related raw signals are grouped into higher-level incidents with
              severity, recommended actions, and supporting evidence.
            </p>
          </div>

          <button
            onClick={refreshIncidents}
            className="w-fit rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
          >
            Refresh Incidents
          </button>
        </div>

        {dashboardIncidents.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <h3 className="text-xl font-semibold text-white">
              No incidents generated
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              More raw signals may be needed before the system can detect a
              larger incident.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {dashboardIncidents.map((incident) => {
                const matchingAnalysis = dashboardAnalyses.find(
                    (analysis)=> analysis.incident_id === incident.id
                );
                return (
                    <IncidentCard
                    key = {incident.id}
                    incident={incident}
                    events = {dashboardEvents}
                    analysis = {matchingAnalysis}
                    />
                );
            })}
          </div>
        )}
      </section>

      <section id="signals">
        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Evidence Stream
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Live Raw Signals
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            These are the unprocessed alerts, reports, and operational signals
            entering the system before they are grouped into incidents.
          </p>
        </div>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="mb-3 text-sm font-semibold text-slate-300">
            Filter by category
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "all"
              )}`}
            >
              All
            </button>

            <button
              onClick={() => setSelectedCategory("weather")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "weather"
              )}`}
            >
              Weather
            </button>

            <button
              onClick={() => setSelectedCategory("transportation")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "transportation"
              )}`}
            >
              Transportation
            </button>

            <button
              onClick={() => setSelectedCategory("building")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "building"
              )}`}
            >
              Building
            </button>

            <button
              onClick={() => setSelectedCategory("power")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "power"
              )}`}
            >
              Power
            </button>

            <button
              onClick={() => setSelectedCategory("network")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "network"
              )}`}
            >
              Network
            </button>

            <button
              onClick={() => setSelectedCategory("user_report")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedCategory === "user_report"
              )}`}
            >
              User Reports
            </button>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="mb-3 text-sm font-semibold text-slate-300">
            Filter by severity
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSeverity("all")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedSeverity === "all"
              )}`}
            >
              All
            </button>

            <button
              onClick={() => setSelectedSeverity("high")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedSeverity === "high"
              )}`}
            >
              High
            </button>

            <button
              onClick={() => setSelectedSeverity("medium")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedSeverity === "medium"
              )}`}
            >
              Medium
            </button>

            <button
              onClick={() => setSelectedSeverity("low")}
              className={`rounded-full border px-4 py-2 text-sm transition ${getFilterButtonStyles(
                selectedSeverity === "low"
              )}`}
            >
              Low
            </button>
          </div>
        </div>

        <p className="mb-5 text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-200">
            {filteredEvents.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-200">
            {dashboardEvents.length}
          </span>{" "}
          events.
        </p>

        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <h3 className="text-xl font-semibold text-white">
              No matching events
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Try changing the category or severity filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}