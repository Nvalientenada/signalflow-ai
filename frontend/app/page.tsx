import EventDashboard from "@/components/EventDashboard";

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
  location_name:string;
  latitude: number;
  longitude: number;
  timestamp: string;
  severity: "low" | "medium" | "high";
  status: string;
};

type Incident = {
  id: number;
  title: string;
  summary: string;
  severity: "low" | "medium" | "high";
  status: "active" | "monitoring" | "resolved" ;
  affected_area: string;
  recommended_action: string;
  evidence_event_ids: number[];
};

async function getBackendHealth() {
  try{
    const response = await fetch("http://127.0.0.1:8000/health", {
      cache: "no-store",
    });

    if (!response.ok){
      return{
        status: "error",
        service:"Backend returned an error",
      };
    }
    return response.json();
  } catch {
    return {
      status: "offline",
      service: " Could not connect to backend",
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
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div>
            <p className="mb-4 w-fit rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300">
              SignalFlow AI
            </p>

            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Incident Intelligence Dashboard
            </h1>

            <p className="max-w-3xl text-lg text-slate-300">
              A full-stack AI system that collects raw signals, detects
              disruptions, and generates evidence-based incident summaries and
              recommended actions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Backend Status</p>
              <p
                className={
                  isConnected
                    ? "mt-2 font-semibold text-green-400"
                    : "mt-2 font-semibold text-red-400"
                }
              >
                {isConnected ? "Connected" : "Offline"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Raw Events</p>
              <p className="mt-2 text-2xl font-bold">{events.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Incidents</p>
              <p className="mt-2 text-2xl font-bold">{incidents.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Service</p>
              <p className="mt-2 font-semibold text-slate-200">
                {backendHealth.service}
              </p>
            </div>
          </div>
        </div>

        <EventDashboard events={events} incidents={incidents} />
      </section>
    </main>
  );
}
