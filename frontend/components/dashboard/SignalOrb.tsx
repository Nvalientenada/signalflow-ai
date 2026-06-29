type SignalOrbProps = {
  label?: string;
};

export default function SignalOrb({ label = "AI" }: SignalOrbProps) {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <div className="absolute h-40 w-40 rounded-full border border-cyan-400/20" />
      <div className="absolute h-28 w-28 rounded-full border border-purple-400/20" />
      <div className="absolute h-16 w-16 rounded-full border border-cyan-300/30 bg-cyan-400/10 blur-sm" />

      <div className="signal-pulse absolute h-24 w-24 rounded-full border border-cyan-300/30" />
      <div className="signal-pulse absolute h-32 w-32 rounded-full border border-purple-300/20 [animation-delay:700ms]" />

      <span className="orbit-dot absolute h-3 w-3 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" />

      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/30 bg-slate-950/80 text-xl font-black text-cyan-100 shadow-2xl shadow-cyan-500/20">
        {label}
      </div>
    </div>
  );
}