"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GlobeVisual from "./GlobeVisual";

const suggestedLocations = [
  "Schenectady, NY",
  "New York, NY",
  "Boston, MA",
  "Casablanca, Morocco",
];

export default function LocationSelector() {
  const router = useRouter();
  const [locationName, setLocationName] = useState("Schenectady, NY"); // stores selected location

  function handleStartMonitoring() {
    const encodedLocation = encodeURIComponent(locationName.trim());

    if (!encodedLocation) {
      return;
    }

    router.push(`/?location=${encodedLocation}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-3 w-fit rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              SignalFlow AI Location Setup
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Select a monitoring area
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Choose the location SignalFlow should watch for weather,
              transportation, infrastructure, and user-reported disruptions.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_520px] lg:items-stretch">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Operating Location
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
              Where should SignalFlow listen?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              For now, this selection prepares the dashboard route. In the next
              milestones, this location will be sent to real geocoding and
              weather services to import live signals.
            </p>

            <div className="mt-8">
              <label
                htmlFor="location"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Search location
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="location"
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  placeholder="Example: Schenectady, NY"
                  className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-5 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                />

                <button
                  onClick={handleStartMonitoring}
                  className="min-h-14 rounded-2xl bg-cyan-300 px-6 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
                >
                  Start Monitoring
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-slate-300">
                Suggested areas
              </p>

              <div className="flex flex-wrap gap-3">
                {suggestedLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setLocationName(location)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-100"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Step 1
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-100">
                  Select area
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Step 2
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-100">
                  Fetch signals
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Step 3
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-100">
                  Generate incidents
                </p>
              </div>
            </div>
          </section>

          <GlobeVisual />
        </div>
      </div>
    </main>
  );
}