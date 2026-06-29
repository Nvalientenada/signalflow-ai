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

function getCategoryDot(category: RawEvent["category"]) {
  const styles = {
    weather: "bg-blue-300",
    transportation: "bg-cyan-300",
    building: "bg-purple-300",
    power: "bg-yellow-300",
    network: "bg-green-300",
    user_report: "bg-pink-300",
  };

  return styles[category];
}

function getCategoryIcon(category: RawEvent["category"]) {
  const icons = {
    weather: "☔",
    transportation: "↗",
    building: "⌂",
    power: "⚡",
    network: "◌",
    user_report: "!",
  };

  return icons[category];
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sm shadow-lg shadow-black/20">
            <span
                className={`absolute h-2.5 w-2.5 rounded-full blur-sm ${getCategoryDot(
                event.category
                )}`}
            />
            <span className="relative text-slate-100">
                {getCategoryIcon(event.category)}
            </span>
            </span>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {getCategoryLabel(event.category)}
            </p>

            <h3 className="mt-1 truncate text-lg font-semibold text-white transition group-hover:text-cyan-100">
              {event.title}
            </h3>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityStyles(
            event.severity
          )}`}
        >
          {event.severity.toUpperCase()}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-6 text-slate-300">
        {event.message}
      </p>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="mt-1 truncate text-slate-200">{event.location_name}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Source
          </p>
          <p className="mt-1 truncate text-slate-200">{event.source}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Status
          </p>
          <p className="mt-1 truncate text-slate-200">{event.status}</p>
        </div>
      </div>
    </article>
  );
}