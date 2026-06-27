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

function getSeverityStyles(severity: RawEvent["severity"]){
  if (severity === "high"){
    return "border-red-400/40 bg-red-500/10 text-red-300";
  }

  if (severity === "medium"){
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

export default async function Home() {
  const backendHealth = await getBackendHealth();
  const events = await getEvents();

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
              disruptions, and will later generate evidence-based incident
              summaries and recommended actions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
              <p className="text-sm text-slate-400">Service</p>
              <p className="mt-2 font-semibold text-slate-200">
                {backendHealth.service}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Live Raw Signals</h2>
            <p className="mt-1 text-sm text-slate-400">
              These are the unprocessed alerts, reports, and operational signals
              coming into the system.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
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
      </section>
    </main>
  );
}