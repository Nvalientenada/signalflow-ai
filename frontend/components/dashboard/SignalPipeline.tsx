const steps = [
  {
    number: "01",
    title: "Collect",
    description: "Raw alerts, reports, outages, and transport signals enter.",
    tone: "cyan",
  },
  {
    number: "02",
    title: "Cluster",
    description: "Related signals are grouped into evidence-backed incidents.",
    tone: "purple",
  },
  {
    number: "03",
    title: "Act",
    description: "The system surfaces severity, evidence, and next actions.",
    tone: "green",
  },
];

function getToneClasses(tone: string) {
  if (tone === "purple") {
    return {
      card: "border-purple-400/20 bg-purple-500/10",
      text: "text-purple-300",
      dot: "bg-purple-300",
    };
  }

  if (tone === "green") {
    return {
      card: "border-green-400/20 bg-green-500/10",
      text: "text-green-300",
      dot: "bg-green-300",
    };
  }

  return {
    card: "border-cyan-400/20 bg-cyan-500/10",
    text: "text-cyan-300",
    dot: "bg-cyan-300",
  };
}

export default function SignalPipeline() {
  return (
    <section className="relative grid gap-4 lg:grid-cols-3">
      {steps.map((step) => {
        const tone = getToneClasses(step.tone);

        return (
          <div
            key={step.number}
            className={`relative overflow-hidden rounded-3xl border p-5 shadow-lg shadow-black/20 ${tone.card}`}
          >
            <div className="scan-line absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sm font-bold ${tone.text}`}
              >
                {step.number}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                  <h3 className="text-xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}