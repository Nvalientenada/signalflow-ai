"use client";

import { FormEvent, useState } from "react";

type SeverityLevel = "low" | "medium" | "high";

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
  severity: SeverityLevel;
  status: string;
};

type UserReportFormProps = {
  onReportCreated: (event: RawEvent) => void;
};

const quickSignals = [
  {
    label: "Flooding",
    message: "There is water pooling near the library entrance.",
    location: "Library",
    severity: "medium" as SeverityLevel,
  },
  {
    label: "Fire drill",
    message: "There is a fire drill in College Park Hall building.",
    location: "College Park Hall building",
    severity: "medium" as SeverityLevel,
  },
  {
    label: "Blocked entrance",
    message: "The north entrance is blocked and students are being redirected.",
    location: "North Entrance",
    severity: "high" as SeverityLevel,
  },
  {
    label: "Wi-Fi issue",
    message: "Wi-Fi is unstable and very slow in the library.",
    location: "Library",
    severity: "low" as SeverityLevel,
  },
];

function getSeverityButtonStyles(
  currentSeverity: SeverityLevel,
  buttonSeverity: SeverityLevel
) {
  const isActive = currentSeverity === buttonSeverity;

  if (buttonSeverity === "high") {
    return isActive
      ? "border-red-400 bg-red-500/20 text-red-200 shadow-lg shadow-red-500/10"
      : "border-white/10 bg-white/5 text-slate-300 hover:border-red-400/40 hover:bg-red-500/10";
  }

  if (buttonSeverity === "medium") {
    return isActive
      ? "border-yellow-400 bg-yellow-500/20 text-yellow-100 shadow-lg shadow-yellow-500/10"
      : "border-white/10 bg-white/5 text-slate-300 hover:border-yellow-400/40 hover:bg-yellow-500/10";
  }

  return isActive
    ? "border-green-400 bg-green-500/20 text-green-200 shadow-lg shadow-green-500/10"
    : "border-white/10 bg-white/5 text-slate-300 hover:border-green-400/40 hover:bg-green-500/10";
}

function getSeverityDot(severity: SeverityLevel) {
  if (severity === "high") {
    return "bg-red-300 shadow-red-300/40";
  }

  if (severity === "medium") {
    return "bg-yellow-300 shadow-yellow-300/40";
  }

  return "bg-green-300 shadow-green-300/40";
}

export default function UserReportForm({
  onReportCreated,
}: UserReportFormProps) {
  const [message, setMessage] = useState("");
  const [locationName, setLocationName] = useState("");
  const [severity, setSeverity] = useState<SeverityLevel>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const hasPreview = message.trim().length > 0 || locationName.trim().length > 0; // show a preview if user typed message or location
  const characterCount = message.length;

  function applyQuickSignal(signal: (typeof quickSignals)[number]) {
    setMessage(signal.message);
    setLocationName(signal.location);
    setSeverity(signal.severity);
    setFormError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (message.trim().length < 5) {
      setFormError("Please enter a report message with at least 5 characters.");
      return;
    }

    if (locationName.trim().length < 2) {
      setFormError("Please enter a location.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          location_name: locationName.trim(),
          severity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report.");
      }

      const createdEvent: RawEvent = await response.json();

      onReportCreated(createdEvent);

      setMessage("");
      setLocationName("");
      setSeverity("medium");
      setSuccessMessage("Signal submitted and added to the event stream.");
    } catch {
      setFormError("Something went wrong while submitting the signal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
      <div className="scan-line absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Signal Console
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Submit a User Report
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create a new signal, preview how it enters the system, and watch
              the incident layer update.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Input Mode
            </p>
            <p className="mt-1 text-sm text-slate-300">Manual signal entry</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-slate-300">
            Quick signal templates
          </p>

          <div className="flex flex-wrap gap-2">
            {quickSignals.map((signal) => (
              <button
                key={signal.label}
                type="button"
                onClick={() => applyQuickSignal(signal)}
                className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
              >
                {signal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300"
                >
                  Report message
                </label>

                <span className="text-xs text-slate-500"> 
                  {characterCount}/500 
                </span>
              </div>

              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Example: There is flooding near the library entrance."
                maxLength={500}
                className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_320px]">
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Location
                </label>

                <input
                  id="location"
                  value={locationName}
                  onChange={(event) => setLocationName(event.target.value)}
                  placeholder="Example: Library"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Severity
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as SeverityLevel[]).map(
                    (level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSeverity(level)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-semibold capitalize transition ${getSeverityButtonStyles(
                          severity,
                          level
                        )}`}
                      >
                        {level}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {formError && (
              <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {formError}
              </p>
            )}

            {successMessage && (
              <p className="rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting signal..." : "Submit Signal"}
              <span className="ml-2 inline-block transition group-hover:translate-x-1">  {/* better submit button with hover */}
                →
              </span>
            </button>
          </div>

          <aside className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Live Preview
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Incoming Signal
                </h3>
              </div>

              <span
                className={`h-3 w-3 rounded-full shadow-lg ${getSeverityDot(
                  severity
                )}`}
              />
            </div>

            {hasPreview ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Message
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {message || "No message yet"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Location
                    </p>
                    <p className="mt-2 truncate text-sm text-slate-200">
                      {locationName || "No location yet"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Severity
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-200">
                      {severity}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                    Next
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This signal will be added to the raw event stream and used
                    when incidents are refreshed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                <div className="signal-pulse mb-5 h-14 w-14 rounded-full border border-cyan-400/30 bg-cyan-500/10" />

                <p className="text-sm font-medium text-slate-300">
                  Waiting for signal input
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Type a report or select a quick template to preview the
                  signal.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </form>
  );
}