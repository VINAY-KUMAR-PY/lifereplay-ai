interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

export function AnalysisSkeleton() {
  return (
    <div className="mt-8 space-y-6" aria-label="Preparing decision report">
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-16" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 lg:grid-cols-3">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-28" />)}</div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mt-8 space-y-6" aria-label="Loading dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-36 rounded-2xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-56 rounded-2xl" /><Skeleton className="h-56 rounded-2xl" /></div>
    </div>
  );
}

export function CareerReplaySkeleton() {
  return <div className="mt-8 space-y-6" aria-label="Loading career comparison"><Skeleton className="h-20 rounded-2xl" />{[0, 1, 2].map((item) => <div key={item} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-4"><Skeleton className="h-11 w-11 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-28" /></div></div><div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div><Skeleton className="h-32" /></div>)}</div>;
}

export function FutureSimulationSkeleton() {
  return <div className="mt-8 space-y-6" aria-label="Loading future simulation"><Skeleton className="h-16 rounded-2xl" /><Skeleton className="h-24" />{[0, 1, 2].map((item) => <div key={item} className="space-y-4 border-t border-slate-200 pt-8"><div className="flex justify-between"><Skeleton className="h-10 w-56" /><Skeleton className="h-10 w-32" /></div><div className="grid gap-4 lg:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div><Skeleton className="h-40" /></div>)}</div>;
}

export function RecruiterViewSkeleton() {
  return <div className="mt-8 space-y-6" aria-label="Loading recruiter assessment"><div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]"><Skeleton className="h-40" /><Skeleton className="h-40" /></div><Skeleton className="h-32" /><div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div></div>;
}
