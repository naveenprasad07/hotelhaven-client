export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.07] animate-pulse">
      {/* Image placeholder */}
      <div className="skeleton-shimmer" style={{ paddingBottom: '66%', position: 'relative' }}>
        <div className="absolute inset-0 bg-stone-100" />
      </div>

      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 rounded-lg bg-stone-200 w-3/4" />
        {/* Coords */}
        <div className="h-3 rounded bg-stone-100 w-1/2" />
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 rounded bg-stone-100" />
          <div className="h-3 rounded bg-stone-100 w-5/6" />
        </div>
        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 rounded-xl bg-stone-200" />
          <div className="flex-1 h-9 rounded-xl bg-stone-100" />
        </div>
      </div>
    </div>
  );
}
