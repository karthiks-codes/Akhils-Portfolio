import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[80svh] items-center pb-20 pt-36">
      <div className="surface relative w-full overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
        <span aria-hidden="true" className="absolute -right-5 -top-18 font-mono text-[clamp(9rem,28vw,23rem)] font-semibold leading-none tracking-[-.12em] text-white/[.025]">404</span>
        <Compass aria-hidden="true" className="relative text-accent" size={27} />
        <p className="relative mt-12 font-mono text-xs uppercase tracking-[.16em] text-zinc-600">Route not found</p>
        <h1 className="relative mt-4 max-w-[10ch] text-[clamp(3rem,8vw,6.8rem)] font-medium leading-[.94] tracking-[-.065em]">This path doesn’t lead anywhere yet.</h1>
        <p className="relative mt-6 max-w-lg text-base leading-7 text-zinc-500">The page may have moved, or the resource has not been supplied. The project index is a good place to recover.</p>
        <div className="relative mt-8 flex flex-wrap gap-3"><Link href="/" className="button-secondary"><ArrowLeft aria-hidden="true" size={15} />Home</Link><Link href="/projects" className="button-primary">Browse projects</Link></div>
      </div>
    </section>
  );
}
