"use client";
import { IncidentAnalysis } from "./AIAnalysisPanel";

import { useState } from "react";
import DashboardMetricCard from "./DashboardMetricCard";
import SignalOrb from "./SignalOrb";
import EventDashboard from "../EventDashboard";
import type { Incident } from "./IncidentCard";
import { RawEvent } from "./EventCard";

import type { AIStatus } from "@/app/page";

type BackendHealth = {
  status: string;
  service: string;
  version?: string;
};

type DashboardClientProps = {
  initialEvents: RawEvent[];
  initialIncidents: Incident[];
  initialAnalyses: IncidentAnalysis[];
  backendHealth: BackendHealth;
  aiStatus: AIStatus;
};

export default function DashboardClient({
  initialEvents,
  initialIncidents,
  initialAnalyses,
  backendHealth,
  aiStatus,
}: DashboardClientProps) {
  const [dashboardEvents, setDashboardEvents] =
    useState<RawEvent[]>(initialEvents);

  const [dashboardIncidents, setDashboardIncidents] =
    useState<Incident[]>(initialIncidents);

  const [dashboardAnalyses, setDashboardAnalyses] =
    useState<IncidentAnalysis[]>(initialAnalyses);

  const isConnected = backendHealth.status === "ok";

  return (
    <>
      <div className="tech-grid relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <div className="mb-8 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
          <div>
            <p className="mb-4 w-fit rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              AI Incident Intelligence Platform
            </p>

            <h1 className="max-w-4xl text-6xl font-black tracking-tight text-white sm:text-7xl xl:text-8xl">
              SignalFlow AI
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Transform raw alerts, reports, and disruptions into live
              incidents, evidence, and action-ready intelligence.
            </p>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-[260px] rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 shadow-2xl shadow-cyan-500/10">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

              <div className="relative flex flex-col items-center gap-4">
                <SignalOrb label="AI" />

                <div className="w-full space-y-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        Live System
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                        Backend:{" "}
                        <span
                            className={
                            isConnected
                                ? "font-semibold text-green-300"
                                : "font-semibold text-red-300"
                            }
                        >
                            {isConnected ? "Connected" : "Offline"}
                        </span>
                        </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 rounded-full border border-white/10 bg-slate-950/50 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <span
                            className={
                                aiStatus.use_llm_analysis
                                ? "signal-pulse h-2.5 w-2.5 rounded-full bg-green-300"
                                : "signal-pulse h-2.5 w-2.5 rounded-full bg-cyan-300"
                            }
                            />

                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            AI Mode
                            </span>
                        </div>

                        <span className="text-xs font-semibold text-cyan-100">
                            {aiStatus.mode === "llm_enabled" ? "LLM" : "Local"}
                        </span>
                        </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardMetricCard
            label="Raw Events"
            value={dashboardEvents.length}
            helperText="Incoming alerts, reports, and operational signals."
            tone="cyan"
          />

          <DashboardMetricCard
            label="Incidents"
            value={dashboardIncidents.length}
            helperText="Generated from grouped raw evidence."
            tone="purple"
          />

          <DashboardMetricCard
            label="Service"
            value={backendHealth.service}
            helperText={`API version: ${backendHealth.version ?? "unknown"}`}
            tone="amber"
          />
        </div>
      </div>

      <EventDashboard
        dashboardEvents={dashboardEvents}
        dashboardIncidents={dashboardIncidents}
        dashboardAnalyses={dashboardAnalyses}
        setDashboardEvents={setDashboardEvents}
        setDashboardIncidents={setDashboardIncidents}
        setDashboardAnalyses={setDashboardAnalyses}
      />
    </>
  );
}