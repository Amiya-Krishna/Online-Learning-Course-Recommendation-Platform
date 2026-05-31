function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="h-44 rounded-2xl bg-white/5" />
      <div className="mt-5 h-4 w-24 rounded bg-white/10" />
      <div className="mt-4 h-7 w-3/4 rounded bg-white/10" />
      <div className="mt-3 h-4 w-full rounded bg-white/10" />
      <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
      <div className="mt-6 h-11 w-full rounded-2xl bg-white/10" />
    </div>
  );
}

export default SkeletonCard;
