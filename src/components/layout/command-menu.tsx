"use client";

import { Command } from "cmdk";
import {
  Activity,
  BriefcaseBusiness,
  Braces,
  FileText,
  IdCard,
  Mail,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandGithub } from "@/components/ui/brand-icons";
import { assets } from "@/lib/assets/manifest";

const commands = [
  { label: "About", href: "/#about", icon: UserRound },
  { label: "Skills", href: "/#skills", icon: Sparkles },
  { label: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "Certifications", href: "/certifications", icon: IdCard },
  { label: "GitHub", href: "/github", icon: BrandGithub },
  { label: "Resume", href: assets.resume, icon: FileText, external: true },
  { label: "Contact", href: "/contact", icon: Mail },
] as const;

const stack = [
  ["Application", "Next.js 16 / React 19 / TypeScript"],
  ["Interface", "Tailwind CSS / Motion / Radix UI"],
  ["Data + delivery", "MongoDB Atlas / Resend"],
  ["Infrastructure", "Vercel / Cloudflare R2 + Turnstile"],
] as const;

type Panel = "whoami" | "stack" | "status" | null;
type HealthState =
  | { kind: "idle" | "loading" }
  | { kind: "ready"; timestamp: string; release: string }
  | { kind: "error" };

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [health, setHealth] = useState<HealthState>({ kind: "idle" });

  function resetPanel() {
    setPanel(null);
    setHealth({ kind: "idle" });
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) resetPanel();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  function select(href: string, external?: boolean) {
    onOpenChange(false);
    resetPanel();
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else router.push(href);
  }

  async function showStatus() {
    setPanel("status");
    setHealth({ kind: "loading" });
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) throw new Error("Health request failed");
      const result = (await response.json()) as { status?: string; timestamp?: string; release?: string };
      if (result.status !== "ok" || !result.timestamp || !result.release) throw new Error("Invalid health response");
      setHealth({ kind: "ready", timestamp: result.timestamp, release: result.release });
    } catch {
      setHealth({ kind: "error" });
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) resetPanel();
      }}
      label="Navigate Akhil's portfolio"
      className="overflow-hidden"
      contentClassName="fixed left-1/2 top-[14vh] z-[80] w-[min(92vw,39rem)] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#101318]/95 shadow-[0_30px_120px_rgba(0,0,0,.72)] backdrop-blur-2xl"
      overlayClassName="fixed inset-0 z-[70] bg-black/65 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5">
        <Search aria-hidden="true" className="text-zinc-500" size={18} />
        <Command.Input
          autoFocus
          placeholder="Go anywhere or type whoami..."
          className="h-15 w-full border-0 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-zinc-600"
        />
        <kbd className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[0.65rem] text-zinc-500">ESC</kbd>
      </div>
      <Command.List className="max-h-[26rem] overflow-y-auto p-2">
        <Command.Empty className="px-4 py-10 text-center text-sm text-zinc-500">No command found.</Command.Empty>

        {panel === "whoami" ? (
          <div className="m-2 rounded-2xl border border-accent/20 bg-accent/[0.07] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Identity resolved</p>
            <p className="mt-4 text-xl font-semibold text-white">Akhil Karthik Boddupalli</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Software Engineer / AI + ML / Cloud + DevOps / Hyderabad, India</p>
          </div>
        ) : null}

        {panel === "stack" ? (
          <div className="m-2 rounded-2xl border border-accent/20 bg-accent/[0.07] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Build stack</p>
            <div className="mt-4 divide-y divide-white/[.08]">
              {stack.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-zinc-600">{label}</p>
                  <p className="text-sm text-zinc-300">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {panel === "status" ? (
          <div role="status" className="m-2 rounded-2xl border border-accent/20 bg-accent/[0.07] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">System status</p>
            {health.kind === "loading" || health.kind === "idle" ? (
              <p className="mt-4 text-sm text-zinc-400">Checking the live application...</p>
            ) : health.kind === "ready" ? (
              <div className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[.08] bg-black/15 p-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[.12em] text-zinc-600">Application</p>
                  <p className="mt-2 flex items-center gap-2 text-emerald-200"><span className="size-1.5 rounded-full bg-emerald-300" /> Operational</p>
                </div>
                <div className="rounded-xl border border-white/[.08] bg-black/15 p-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[.12em] text-zinc-600">Release</p>
                  <p className="mt-2 text-zinc-300">{health.release}</p>
                </div>
                <p className="text-xs text-zinc-600 sm:col-span-2">Checked {new Date(health.timestamp).toLocaleTimeString("en-IN")}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-amber-100/80">The health endpoint could not be reached. Try again shortly.</p>
            )}
          </div>
        ) : null}

        <Command.Group heading="Navigate" className="px-1 py-2 text-xs text-zinc-600 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[.16em]">
          {commands.map(({ label, href, icon: Icon, ...command }) => (
            <Command.Item
              key={label}
              value={label}
              onSelect={() => select(href, "external" in command ? command.external : false)}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
            >
              <Icon aria-hidden="true" size={17} />
              {label}
            </Command.Item>
          ))}
          <Command.Item
            value="whoami identity developer"
            onSelect={() => setPanel("whoami")}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-mono text-sm text-zinc-300 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
          >
            <span aria-hidden="true" className="text-accent">&gt;_</span>
            whoami
          </Command.Item>
          <Command.Item
            value="stack technologies built with"
            onSelect={() => setPanel("stack")}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-mono text-sm text-zinc-300 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
          >
            <Braces aria-hidden="true" className="text-accent" size={16} /> stack
          </Command.Item>
          <Command.Item
            value="status health uptime release"
            onSelect={() => void showStatus()}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-mono text-sm text-zinc-300 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
          >
            <Activity aria-hidden="true" className="text-accent" size={16} /> status
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
