import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Cloud,
  Database,
  Gauge,
  LogOut,
  MailCheck,
  MessagesSquare,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { signOut } from "@/auth";
import { requireAdmin } from "@/lib/auth/admin";
import { getInsightsSnapshot, type ServiceCheck } from "@/lib/observability/insights";

export const metadata: Metadata = {
  title: "Admin insights",
  description: "Private operational insights for Akhil's portfolio.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusOrder = ["delivered", "sent", "pending", "delayed", "failed"];

async function signOutAdmin() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
}

function serviceTone(state: ServiceCheck["state"]) {
  if (state === "operational") return "border-emerald-300/20 bg-emerald-300/[.06] text-emerald-200";
  if (state === "degraded") return "border-amber-300/20 bg-amber-300/[.06] text-amber-100";
  return "border-white/10 bg-white/[.025] text-zinc-500";
}

function serviceLabel(state: ServiceCheck["state"]) {
  if (state === "operational") return "Operational";
  if (state === "degraded") return "Attention";
  return "Not configured";
}

function formatTimestamp(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default async function AdminInsightsPage() {
  const admin = await requireAdmin();
  const snapshot = await getInsightsSnapshot();
  const metrics = [
    { label: "All submissions", value: snapshot.submissions.total, detail: `${snapshot.submissions.contacts} contacts · ${snapshot.submissions.suggestions} suggestions` },
    { label: "Last 24 hours", value: snapshot.submissions.last24Hours, detail: "New form submissions" },
    { label: "Last 7 days", value: snapshot.submissions.last7Days, detail: "Rolling weekly volume" },
    { label: "Last 30 days", value: snapshot.submissions.last30Days, detail: "Rolling monthly volume" },
  ];
  const orderedStatuses = Object.entries(snapshot.submissions.statuses).sort(
    ([a], [b]) => statusOrder.indexOf(a) - statusOrder.indexOf(b),
  );

  return (
    <section className="section-shell min-h-screen pb-28 pt-32 sm:pt-36">
      <header className="flex flex-col gap-7 border-b border-white/10 pb-9 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow before:hidden">Admin / Insights</p>
            <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[.58rem] uppercase tracking-[.14em] text-zinc-500">
              {snapshot.environment}
            </span>
          </div>
          <h1 className="mt-5 text-5xl font-medium tracking-[-.06em] sm:text-6xl">System pulse.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-500">
            A private operational view of form delivery, infrastructure configuration, and live service probes. Message content and visitor identities are intentionally excluded.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-500">
            {admin.name} · {admin.email}
          </div>
          <form action={signOutAdmin}>
            <button className="button-secondary !min-h-10 !px-4 !py-2 text-xs" type="submit">
              Sign out <LogOut aria-hidden="true" size={14} />
            </button>
          </form>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[.62rem] uppercase tracking-[.13em] text-zinc-600">
        <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" size={13} /> Generated {formatTimestamp(snapshot.generatedAt)}</span>
        <span>Release {snapshot.release}</span>
      </div>

      <section aria-labelledby="submission-heading" className="mt-14">
        <div className="flex items-center gap-3">
          <MessagesSquare aria-hidden="true" className="text-accent" size={19} />
          <h2 id="submission-heading" className="font-mono text-xs uppercase tracking-[.16em]">Submission flow</h2>
        </div>
        {!snapshot.submissions.available ? (
          <p className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[.05] px-4 py-3 text-sm text-amber-100/75">
            Live submission summaries are unavailable. Check the MongoDB service card below.
          </p>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="surface rounded-[1.5rem] p-5">
              <p className="font-mono text-[.62rem] uppercase tracking-[.14em] text-zinc-600">{metric.label}</p>
              <p className="mt-5 text-4xl font-medium tracking-[-.05em]">{snapshot.submissions.available ? metric.value : "—"}</p>
              <p className="mt-3 text-xs leading-5 text-zinc-600">{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
        <section aria-labelledby="delivery-heading" className="surface rounded-[1.7rem] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <MailCheck aria-hidden="true" className="text-accent" size={18} />
            <h2 id="delivery-heading" className="font-mono text-xs uppercase tracking-[.16em]">Delivery state</h2>
          </div>
          <div className="mt-7 space-y-5">
            {orderedStatuses.length ? orderedStatuses.map(([status, count]) => {
              const width = snapshot.submissions.total ? Math.max(4, (count / snapshot.submissions.total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="capitalize text-zinc-400">{status.replaceAll("_", " ")}</span>
                    <span className="font-mono text-xs text-zinc-600">{count}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.05]">
                    <div className="h-full rounded-full bg-accent/70" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-sm leading-6 text-zinc-600">No persisted delivery records yet.</p>}
          </div>
        </section>

        <section aria-labelledby="recent-heading" className="surface rounded-[1.7rem] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Activity aria-hidden="true" className="text-accent" size={18} />
            <h2 id="recent-heading" className="font-mono text-xs uppercase tracking-[.16em]">Recent activity</h2>
          </div>
          <div className="mt-5 divide-y divide-white/[.08]">
            {snapshot.submissions.recent.length ? snapshot.submissions.recent.map((submission) => (
              <article key={submission._id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm text-zinc-300">
                    {submission.type === "contact" ? "Contact message" : submission.projectName ?? "Project suggestion"}
                  </p>
                  <p className="mt-1 font-mono text-[.6rem] uppercase tracking-[.12em] text-zinc-600">
                    {submission._id.slice(0, 8)} · {formatTimestamp(submission.createdAt)}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/10 px-2.5 py-1 font-mono text-[.58rem] uppercase tracking-[.12em] text-zinc-500">
                  {submission.deliveryStatus}
                </span>
              </article>
            )) : <p className="py-5 text-sm text-zinc-600">No recent submissions.</p>}
          </div>
        </section>
      </div>

      <section aria-labelledby="services-heading" className="mt-16">
        <div className="flex items-center gap-3">
          <Radio aria-hidden="true" className="text-accent" size={19} />
          <h2 id="services-heading" className="font-mono text-xs uppercase tracking-[.16em]">Service health</h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {snapshot.services.map((service) => (
            <article key={service.id} className="surface rounded-[1.5rem] p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-medium">{service.label}</h3>
                <span className={`rounded-full border px-2.5 py-1 font-mono text-[.56rem] uppercase tracking-[.12em] ${serviceTone(service.state)}`}>
                  {serviceLabel(service.state)}
                </span>
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-600">{service.detail}</p>
              {service.latencyMs !== undefined ? <p className="mt-3 font-mono text-[.6rem] uppercase tracking-[.12em] text-zinc-700">Probe {service.latencyMs} ms</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="platforms-heading" className="mt-16 border-t border-white/10 pt-10">
        <div className="flex items-center gap-3">
          <Gauge aria-hidden="true" className="text-accent" size={19} />
          <h2 id="platforms-heading" className="font-mono text-xs uppercase tracking-[.16em]">Provider consoles</h2>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {[
            { label: "Vercel", href: "https://vercel.com/dashboard", icon: Cloud },
            { label: "Cloudflare", href: "https://dash.cloudflare.com/", icon: ShieldCheck },
            { label: "MongoDB Atlas", href: "https://cloud.mongodb.com/v2", icon: Database },
            { label: "Resend", href: "https://resend.com/emails", icon: MailCheck },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} target="_blank" rel="noreferrer" className="button-secondary">
              <Icon aria-hidden="true" size={15} /> {label} <ArrowUpRight aria-hidden="true" size={13} />
            </Link>
          ))}
          <Link href="/api/health" target="_blank" className="button-secondary">
            <CheckCircle2 aria-hidden="true" size={15} /> Health endpoint <ArrowUpRight aria-hidden="true" size={13} />
          </Link>
        </div>
      </section>

      <aside className="mt-10 flex items-start gap-3 rounded-2xl border border-white/[.08] bg-white/[.018] p-4 text-xs leading-5 text-zinc-600">
        <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0" size={15} />
        Vercel request logs and Speed Insights remain in Vercel; R2 operations remain in Cloudflare. This page intentionally summarizes application-owned signals rather than copying provider telemetry into another database.
      </aside>
    </section>
  );
}
