function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
      <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
