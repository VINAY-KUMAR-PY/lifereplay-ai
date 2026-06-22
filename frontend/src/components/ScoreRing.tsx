interface ScoreRingProps {
  score: number;
  label: string;
}

export function ScoreRing({ score, label }: ScoreRingProps) {
  const value = Math.max(0, Math.min(100, score));

  return (
    <div className="flex items-center gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div
        className="grid h-20 w-20 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#14b8a6 ${value * 3.6}deg, #e2e8f0 0deg)`
        }}
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-lg font-black text-slate-950 dark:bg-slate-950 dark:text-slate-50">
          {value}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">Score out of 100</p>
      </div>
    </div>
  );
}
