function Skeleton({ className = '', style }) {
  return (
    <NeoSkeleton
      role="status"
      aria-label="Loading…"
      className={`skeleton ${className}`}
      style={style}
    />
  );
}

Skeleton.Card = function SkeletonCard({ lines = 2 }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3" aria-busy="true" aria-label="Loading content">
      <Skeleton className="h-4 w-2/3 rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 rounded ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
};

Skeleton.ChartBlock = function SkeletonChartBlock() {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6" aria-busy="true" aria-label="Loading chart">
      <Skeleton className="h-4 w-48 mb-2 rounded" />
      <Skeleton className="h-3 w-64 mb-5 rounded" />
      <div className="flex items-end gap-3 h-44 px-4">
        {[60, 85, 45, 70].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};

Skeleton.CompCard = function SkeletonCompCard() {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4" aria-busy="true" aria-label="Loading comparison">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <Skeleton className="h-9 w-20 rounded-lg shrink-0" />
    </div>
  );
};

export default Skeleton;
import { Skeleton as NeoSkeleton } from './ui/skeleton.jsx';
