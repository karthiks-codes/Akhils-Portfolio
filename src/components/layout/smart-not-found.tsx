"use client";

import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

export function SmartNotFound() {
  const router = useRouter();
  const buffer = useRef("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [destination, setDestination] = useState<"home" | "projects" | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
      buffer.current = `${buffer.current}${event.key.toLowerCase()}`.slice(-8);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        buffer.current = "";
      }, 1400);

      if (buffer.current.endsWith("projects")) {
        setDestination("projects");
        router.push("/projects");
      } else if (buffer.current.endsWith("home")) {
        setDestination("home");
        router.push("/");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [router]);

  return (
    <section className="section-shell flex min-h-[80svh] items-center pb-20 pt-36">
      <div className="surface relative w-full overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
        <span aria-hidden="true" className="absolute -right-5 -top-18 font-mono text-[clamp(9rem,28vw,23rem)] font-semibold leading-none tracking-[-.12em] text-white/[.025]">404</span>
        <Compass aria-hidden="true" className="relative text-accent" size={27} />
        <p className="relative mt-12 font-mono text-xs uppercase tracking-[.16em] text-zinc-600">Route not found</p>
        <h1 className="relative mt-4 max-w-[10ch] text-[clamp(3rem,8vw,6.8rem)] font-medium leading-[.94] tracking-[-.065em]">This path does not lead anywhere yet.</h1>
        <p className="relative mt-6 max-w-lg text-base leading-7 text-zinc-500">The page may have moved, or the resource has not been supplied. The project index is a good place to recover.</p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link href="/" className="button-secondary"><ArrowLeft aria-hidden="true" size={15} />Home</Link>
          <Link href="/projects" className="button-primary">Browse projects</Link>
        </div>
        <p className="relative mt-10 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-zinc-700">
          Keyboard recovery is listening for <span className="text-zinc-500">home</span> or <span className="text-zinc-500">projects</span>.
        </p>
        <p aria-live="polite" className="sr-only">{destination ? `Opening ${destination}.` : ""}</p>
      </div>
    </section>
  );
}
