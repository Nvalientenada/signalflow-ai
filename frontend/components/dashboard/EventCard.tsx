export type RawEvent = {
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
  severity: "low" | "medium" | "high";
  status: string;
};

type EventCardProps = {
  event: RawEvent;
};

export function getSeverityStyles(severity: RawEvent["severity"]) {
  if (severity === "high") {
    return "border-red-400/40 bg-red-500/10 text-red-300";
  }

  if (severity === "medium") {
    return "border-yellow-400/40 bg-yellow-500/10 text-yellow-200";
  }

  return "border-green-400/40 bg-green-500/10 text-green-300";
}

export function getCategoryLabel(category: RawEvent["category"]) {
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

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">
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

      <h3 className="mb-2 text-lg font-semibold text-white transition group-hover:text-cyan-100">
        {event.title}
      </h3>

      <p className="mb-5 text-sm leading-6 text-slate-300">{event.message}</p>

      <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="mt-1 text-slate-200">{event.location_name}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Source
          </p>
          <p className="mt-1 text-slate-200">{event.source}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Status
          </p>
          <p className="mt-1 text-slate-200">{event.status}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Timestamp
          </p>
          <p className="mt-1 text-slate-200">{event.timestamp}</p>
        </div>
      </div>
    </article>
  );
}