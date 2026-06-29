import EventDashboard from "@/components/EventDashboard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import {Incident} from "@/components/dashboard/IncidentCard";
import {RawEvent} from "@/components/dashboard/EventCard";


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
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative flex">
        <DashboardSidebar />

        <section className="w-full px-5 py-6 sm:px-8 lg:px-10">
          <div id="overview" className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
              <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="mb-4 w-fit rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                    AI Incident Intelligence Platform
                  </p>

                  <h1 className="max-w-4xl text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
                    SignalFlow AI
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                    A modern full-stack dashboard that turns messy raw signals
                    into evidence-backed incidents, severity insights, and
                    recommended actions.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
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

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                  label="Backend Status"
                  value={isConnected ? "Online" : "Offline"}
                  helperText="FastAPI service health check."
                  tone={isConnected ? "green" : "amber"}
                />

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
