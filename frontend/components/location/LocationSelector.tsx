"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GlobeVisual from "./GlobeVisual";

type MonitoringScope = {
  id: "building" | "campus" | "city";
  label: string;
  radius: string;
  description: string;
};

const monitoringScopes: MonitoringScope[] = [
  {
    id: "building",
    label: "Building area",
    radius: "1 km",
    description: "Best for one building, entrance, lab, dorm, or facility.",
  },
  {
    id: "campus",
    label: "Campus area",
    radius: "3 km",
    description: "Best for a college campus, business park, or small district.",
  },
  {
    id: "city",
    label: "City area",
    radius: "10 km",
    description: "Best for broader city weather and transportation disruptions.",
  },
];

const suggestedLocations = [
  {
    name: "Wold, Union College",
    type: "Building",
  },
  {
    name: "Union College, Schenectady",
    type: "Campus",
  },
  {
    name: "Schenectady, NY",
    type: "City",
  },
  {
    name: "Casablanca, Morocco",
    type: "City",
  },
];

export default function LocationSelector() {
  const router = useRouter();

  const [locationName, setLocationName] = useState(
    "Wold, Union College"
  );

  const [selectedScope, setSelectedScope] =
    useState<MonitoringScope["id"]>("campus");

  const activeScope = monitoringScopes.find(
    (scope) => scope.id === selectedScope
  );

  function handleStartMonitoring() {
    const cleanedLocation = locationName.trim();

    if (!cleanedLocation) {
      return;
    }

    const encodedLocation = encodeURIComponent(cleanedLocation);
    const encodedScope = encodeURIComponent(selectedScope);

    router.push(`/?location=${encodedLocation}&scope=${encodedScope}`);
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
              Choose a city, campus, building, or address for SignalFlow to
              monitor for live operational disruptions.
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
              Search for a city, campus, building, landmark, or exact address.
              The selected scope controls how wide the monitoring area should
              be.
            </p>

            <div className="mt-8">
              <label
                htmlFor="location"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Search city, campus, building, or address
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="location"
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  placeholder="Example: Wold Center, Union College"
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
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-300">
                  Monitoring scope
                </p>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Radius: {activeScope?.radius}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {monitoringScopes.map((scope) => {
                  const isActive = selectedScope === scope.id;

                  return (
                    <button
                      key={scope.id}
                      onClick={() => setSelectedScope(scope.id)}
                      className={
                        isActive
                          ? "rounded-2xl border border-cyan-300/50 bg-cyan-500/15 p-4 text-left shadow-lg shadow-cyan-500/10 transition"
                          : "rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                      }
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-white">
                          {scope.label}
                        </p>

                        <span
                          className={
                            isActive
                              ? "h-3 w-3 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/60"
                              : "h-3 w-3 rounded-full border border-white/20"
                          }
                        />
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {scope.radius}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {scope.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-slate-300">
                Suggested areas
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {suggestedLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => setLocationName(location.name)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-slate-200">
                        {location.name}
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        {location.type}
                      </span>
                    </span>

                    <span className="text-cyan-300">→</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-200">
                Selected Monitor
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                {locationName || "No location selected"}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Scope: {activeScope?.label} · {activeScope?.radius} radius
              </p>
            </div>
          </section>

          <GlobeVisual />
        </div>
      </div>
    </main>
  );
}