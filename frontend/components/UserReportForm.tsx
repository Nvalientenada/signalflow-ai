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

export default function UserReportForm({
  onReportCreated,
}: UserReportFormProps) {
  const [message, setMessage] = useState("");
  const [locationName, setLocationName] = useState("");
  const [severity, setSeverity] = useState<SeverityLevel>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("Report submitted successfully.");
    } catch {
      setFormError("Something went wrong while submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Submit a User Report</h2>
        <p className="mt-1 text-sm text-slate-400">
          Add a new raw signal to the system. Later, AI will classify and group
          reports like this into larger incidents.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Report message
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Example: There is flooding near the library entrance."
            className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="severity"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Severity
            </label>

            <select
              id="severity"
              value={severity}
              onChange={(event) =>
                setSeverity(event.target.value as SeverityLevel)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {formError && (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      )}

      {successMessage && (
        <p className="mt-4 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}