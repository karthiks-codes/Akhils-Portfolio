"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { ArrowUpRight, Command as CommandIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CommandMenu } from "@/components/layout/command-menu";
import { assets } from "@/lib/assets/manifest";

const links = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <Tooltip.Provider delayDuration={400}>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto mx-auto flex w-full max-w-[76rem] items-center justify-between rounded-[1.25rem] border border-white/10 bg-[#0b0d10]/82 px-3 py-2 shadow-[0_16px_60px_rgba(0,0,0,.36)] backdrop-blur-2xl"
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 items-center gap-2.5 rounded-xl px-2 font-semibold tracking-[-0.02em]"
          >
            <span className="grid size-7 place-items-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[0.7rem] text-accent">
              AK
            </span>
            <span className="hidden sm:inline">Akhil</span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const active = link.href.startsWith("/projects")
                ? pathname.startsWith("/projects")
                : link.href === "/certifications"
                  ? pathname === "/certifications"
                  : link.href === "/contact"
                    ? pathname === "/contact"
                    : false;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-[0.78rem] font-medium transition-colors ${
                    active ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open command menu"
                  onClick={() => setCommandOpen(true)}
                  className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 text-xs text-zinc-400 transition-colors hover:border-white/20 hover:text-white sm:flex"
                >
                  <CommandIcon aria-hidden="true" size={14} />
                  <span className="font-mono">⌘K</span>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={8} className="z-[90] rounded-lg bg-white px-2.5 py-1.5 text-xs text-black shadow-xl">
                  Quick navigation
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            <a href={assets.resume} target="_blank" rel="noreferrer" className="button-primary hidden !min-h-10 !px-3.5 !py-2 sm:inline-flex">
              Resume <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-full border border-white/10 lg:hidden"
            >
              {mobileOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
            </button>
          </div>
        </nav>

        {mobileOpen ? (
          <div className="pointer-events-auto mx-auto mt-2 grid w-full max-w-[76rem] gap-1 rounded-[1.25rem] border border-white/10 bg-[#0b0d10]/96 p-2 shadow-2xl backdrop-blur-2xl lg:hidden">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3.5 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/10 pt-2">
              <button type="button" onClick={() => { setMobileOpen(false); setCommandOpen(true); }} className="button-secondary">
                <CommandIcon aria-hidden="true" size={15} /> Commands
              </button>
              <a href={assets.resume} target="_blank" rel="noreferrer" className="button-primary">
                Resume <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            </div>
          </div>
        ) : null}
      </header>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </Tooltip.Provider>
  );
}
