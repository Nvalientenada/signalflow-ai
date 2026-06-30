import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Incident } from "@/components/dashboard/IncidentCard";
import { RawEvent } from "@/components/dashboard/EventCard";
import { IncidentAnalysis } from "@/components/dashboard/AIAnalysisPanel";

export type AIStatus = {
  use_llm_analysis: boolean;
  mode: string;
  model: string;
};

type HomePageProps = {
  searchParams?: Promise<{
    location?: string;
    scope?: string;
  }>;
};

async function getBackendHealth() {
  try {
    const response = await fetch("http://127.0.0.1:8000/health", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "error",
        service: "Backend returned an error",
        version: "unknown",
      };
    }

    return response.json();
  } catch {
    return {
      status: "offline",
      service: "Could not connect to backend",
      version: "unknown",
    };
  }
}

async function getEvents(): Promise<RawEvent[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/events", {
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

async function getIncidentAnalyses(): Promise<IncidentAnalysis[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/incidents/analysis", {
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

async function getAIStatus(): Promise<AIStatus> {
  try {
    const response = await fetch("http://127.0.0.1:8000/ai/status", {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        use_llm_analysis: false,
        mode: "unknown",
        model: "unknown",
      };
    }

    return response.json();
  } catch {
    return {
      use_llm_analysis: false,
      mode: "unknown",
      model: "unknown",
    };
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;

  const selectedLocation =
    resolvedSearchParams?.location ?? "Schenectady, NY";

  const selectedScope =
    resolvedSearchParams?.scope ?? "city";

  const backendHealth = await getBackendHealth();
  const events = await getEvents();
  const incidents = await getIncidents();
  const analyses = await getIncidentAnalyses();
  const aiStatus = await getAIStatus();

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
            <DashboardClient
              initialEvents={events}
              initialIncidents={incidents}
              initialAnalyses={analyses}
              backendHealth={backendHealth}
              aiStatus={aiStatus}
              selectedLocation={selectedLocation}
              selectedScope={selectedScope}
            />
          </div>
        </section>
      </div>
    </main>
  );
}