"use client";

import {useState} from "react";
import UserReportForm from "./UserReportForm";

type RawEvent = {
  id: number;
  source: string;
  category:
    | "weather"
    | "transportation"
    | "building"
    | "power"
    | "network"
    | "user_report";
  title: string;
  message: string;
  location_name: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  severity: "low" | "medium" | "high";
  status: string;
};

type CategoryFilter = RawEvent["category"] | "all";
type SeverityFilter = RawEvent["severity"] | "all";

type EventDashboardProps = {
  events: RawEvent[];
};

function getSeverityStyles(severity: RawEvent["severity"]) {
  if (severity === "high") {
    return "border-red-400/40 bg-red-500/10 text-red-300";
  }

  if (severity === "medium") {
    return "border-yellow-400/40 bg-yellow-500/10 text-yellow-200";
  }

  return "border-green-400/40 bg-green-500/10 text-green-300";
}

function getCategoryLabel(category: RawEvent["category"]) {
  const labels = {
    weather: "Weather",
    transportation: "Transportation",
    building: "Building",
    power: "Power",
    network: "Network",
    user_report: "User Report",
  };

  return labels[category];
}

function getFilterButtonStyles(isActive: boolean) {
  if (isActive) {
    return "border-cyan-400 bg-cyan-500/20 text-cyan-100";
  }

  return "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-500/10";
}

export default function EventDashboard({ events }: EventDashboardProps) {
  const [dashboardEvents, setDashboardEvents] = useState<RawEvent[]>(events);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  const [selectedSeverity, setSelectedSeverity] =
    useState<SeverityFilter>("all");

  const filteredEvents = dashboardEvents.filter((event) => {
    const categoryMatches =
      selectedCategory === "all" || event.category === selectedCategory;

    const severityMatches =
      selectedSeverity === "all" || event.severity === selectedSeverity;

    return categoryMatches && severityMatches;
  });

  return (
  <>
    <UserReportForm
      onReportCreated={(newEvent) => {
        setDashboardEvents((currentEvents) => [newEvent, ...currentEvents]);
        setSelectedCategory("all");
        setSelectedSeverity("all");
      }}
    />
    <div className="mb-6 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Live Raw Signals</h2>
          <p className="mt-1 text-sm text-slate-400">
            These are the unprocessed alerts, reports, and operational signals
            coming into the system.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
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

        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-200">
            {filteredEvents.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-200">{dashboardEvents.length}</span>{" "}
          events.
        </p>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h3 className="text-xl font-semibold">No matching events</h3>
          <p className="mt-2 text-sm text-slate-400">
            Try changing the category or severity filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                  {getCategoryLabel(event.category)}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getSeverityStyles(
                    event.severity
                  )}`}
                >
                  {event.severity.toUpperCase()}
                </span>
              </div>

              <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>

              <p className="mb-5 text-sm leading-6 text-slate-300">
                {event.message}
              </p>

              <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Location</p>
                  <p className="text-slate-200">{event.location_name}</p>
                </div>

                <div>
                  <p className="text-slate-500">Source</p>
                  <p className="text-slate-200">{event.source}</p>
                </div>

                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="text-slate-200">{event.status}</p>
                </div>

                <div>
                  <p className="text-slate-500">Timestamp</p>
                  <p className="text-slate-200">{event.timestamp}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}