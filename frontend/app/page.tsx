import EventDashboard from "@/components/EventDashboard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import {Incident} from "@/components/dashboard/IncidentCard";
import {RawEvent} from "@/components/dashboard/EventCard";
import SignalOrb from "@/components/dashboard/SignalOrb";

async function getBackendHealth() {
  try{
    const response = await fetch("http://127.0.0.1:8000/health", {
      cache: "no-store",
    });

    if (!response.ok){
      return{
        status: "error",
        service:"Backend returned an error",
        version: "unknown",
      };
    }
    return response.json();
  } catch {
    return {
      status: "offline",
      service: " Could not connect to backend",
      version:"unknown",
    };
  }
}

async function getEvents(): Promise<RawEvent[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/events", {
      cache: "no-store",
    });
    if (!response.ok){
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

async function getIncidents(): Promise<Incident[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/incidents", {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const backendHealth = await getBackendHealth();
  const events = await getEvents();
  const incidents = await getIncidents();

  const isConnected = backendHealth.status === "ok";

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="tech-grid absolute inset-0 opacity-30" />

        <div className="glow-breathe absolute left-[18%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="glow-breathe absolute right-[-8%] top-[22%] h-[30rem] w-[30rem] rounded-full bg-purple-500/10 blur-3xl [animation-delay:1200ms]" />
        <div className="glow-breathe absolute bottom-[-12%] left-[45%] h-[26rem] w-[26rem] rounded-full bg-blue-500/10 blur-3xl [animation-delay:2200ms]" />

        <div className="drift-diagonal absolute left-[-10%] top-[15%] h-40 w-[55rem] rotate-12 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-2xl" />
        <div className="drift-diagonal absolute right-[-18%] top-[58%] h-40 w-[55rem] -rotate-12 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent blur-2xl [animation-delay:1800ms]" />

        <div className="data-rain absolute left-[14%] top-0 h-28 w-px bg-cyan-300/30" />
        <div className="data-rain absolute left-[37%] top-0 h-20 w-px bg-purple-300/30 [animation-delay:1400ms]" />
        <div className="data-rain absolute left-[68%] top-0 h-24 w-px bg-cyan-300/30 [animation-delay:2600ms]" />
        <div className="data-rain absolute left-[86%] top-0 h-16 w-px bg-green-300/25 [animation-delay:3600ms]" />
      </div>

      <div className="relative flex">
        <DashboardSidebar />

        <section className="w-full px-5 py-6 sm:px-8 lg:px-10">
          <div id="overview" className="mx-auto max-w-7xl">
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
                    Transform raw alerts, reports, and disruptions into live incidents,
                    evidence, and action-ready intelligence.
                  </p>
                </div>

                <div className="hidden lg:flex lg:justify-end">
                  <div className="relative w-full max-w-[260px] rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 shadow-2xl shadow-cyan-500/10">
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

                    <div className="relative flex flex-col items-center gap-4">
                      <SignalOrb label="AI" />

                      <div className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <DashboardMetricCard
                  label="Raw Events"
                  value={events.length}
                  helperText="Incoming alerts, reports, and operational signals."
                  tone="cyan"
                />

                <DashboardMetricCard
                  label="Incidents"
                  value={incidents.length}
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

            <EventDashboard events={events} incidents={incidents} />
          </div>
        </section>
      </div>
    </main>
  );
}
