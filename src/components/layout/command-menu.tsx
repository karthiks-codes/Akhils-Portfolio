"use client";

import { Command } from "cmdk";
import { BriefcaseBusiness, FileText, IdCard, Mail, Search, Sparkles, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { assets } from "@/lib/assets/manifest";
import { BrandGithub } from "@/components/ui/brand-icons";

const commands = [
  { label: "About", href: "/#about", icon: UserRound },
  { label: "Skills", href: "/#skills", icon: Sparkles },
  { label: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "Certifications", href: "/certifications", icon: IdCard },
  { label: "GitHub", href: "/github", icon: BrandGithub },
  { label: "Resume", href: assets.resume, icon: FileText, external: true },
  { label: "Contact", href: "/contact", icon: Mail },
] as const;

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [whoami, setWhoami] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  function select(href: string, external?: boolean) {
    onOpenChange(false);
    setWhoami(false);
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else router.push(href);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setWhoami(false);
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
          placeholder="Go anywhere or type whoami…"
          className="h-15 w-full border-0 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-zinc-600"
        />
        <kbd className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[0.65rem] text-zinc-500">
          ESC
        </kbd>
      </div>
      <Command.List className="max-h-[24rem] overflow-y-auto p-2">
        <Command.Empty className="px-4 py-10 text-center text-sm text-zinc-500">No command found.</Command.Empty>
        {whoami ? (
          <div className="m-2 rounded-2xl border border-accent/20 bg-accent/[0.07] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Identity resolved</p>
            <p className="mt-4 text-xl font-semibold text-white">Akhil Karthik Boddupalli</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Software Engineer · AI / ML · Cloud / DevOps · Hyderabad, India</p>
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
            onSelect={() => setWhoami(true)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-mono text-sm text-zinc-300 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
          >
            <span aria-hidden="true" className="text-accent">›_</span>
            whoami
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
