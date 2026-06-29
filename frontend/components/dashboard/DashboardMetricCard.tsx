type DashboardMetricCardProps = {
    label:string;
    value: string | number;
    helperText: string;
    tone?: "cyan" | "green" | "purple" | "amber";
};

const toneStyles = {
    cyan: "from-cyan-400/20 to-blue-500/5 text-cyan-200 border-cyan-400/20",
    green: "from-green-400/20 to-emerald-500/5 text-green-200 border-green-400/20",
    purple: "from-purple-400/20 to-fuchsia-500/5 text-purple-200 border-purple-400/20",
    amber: "from-amber-400/20 to-yellow-500/5 text-amber-200 border-amber-400/20",
};

export default function DashboardMetricCard({
  label,
  value,
  helperText,
  tone = "cyan",
}: DashboardMetricCardProps) {
  return (
    <div
        className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 ${toneStyles[tone]}`}
    >
      <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-white/10 blur-2xl transition group-hover:scale-125" />

      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>

      <p className="mt-2 text-xs leading-5 text-slate-400">{helperText}</p>
    </div>
  );
}
