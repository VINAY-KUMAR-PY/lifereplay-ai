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
