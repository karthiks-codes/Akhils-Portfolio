export default function InsightsLoading() {
  return (
    <section className="section-shell min-h-[80svh] pb-24 pt-36 sm:pt-40" aria-busy="true" aria-label="Loading insights">
      <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
      <div className="mt-5 h-14 max-w-xl animate-pulse rounded-2xl bg-white/[.06]" />
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-[1.5rem] border border-white/[.08] bg-white/[.025]" />)}
      </div>
    </section>
  );
}
