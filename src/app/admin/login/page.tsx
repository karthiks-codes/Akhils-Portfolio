import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

import { auth, signIn } from "@/auth";
import { getAuthConfig } from "@/lib/env";
import { isAdminEmail } from "@/lib/auth/policy";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function signInWithGoogle() {
  "use server";
  if (!getAuthConfig().configured) redirect("/admin/login?error=configuration");
  await signIn("google", { redirectTo: "/admin/insights" });
}

function errorMessage(error?: string) {
  if (error === "configuration") return "Google authentication is not configured in this environment yet.";
  if (error === "AccessDenied") return "That Google account is not authorized for this admin panel.";
  if (error) return "Google sign-in could not be completed. Please try again.";
  return null;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const config = getAuthConfig();
  if (config.configured) {
    const session = await auth();
    if (isAdminEmail(session?.user?.email, config.adminEmails)) redirect("/admin/insights");
  }
  const message = errorMessage(params.error);

  return (
    <section className="section-shell flex min-h-[78svh] items-center justify-center pb-20 pt-36 sm:pt-40">
      <div className="surface relative w-full max-w-[32rem] overflow-hidden rounded-[2rem] p-6 sm:p-9">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-accent">
          <KeyRound aria-hidden="true" size={21} />
        </div>
        <p className="eyebrow mt-8 before:hidden">Private workspace</p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-.05em] sm:text-5xl">Portfolio insights</h1>
        <p className="mt-5 text-sm leading-6 text-zinc-500">
          Sign in with the allowlisted Google account to inspect service health, submission delivery, and production signals.
        </p>

        {message ? (
          <p role="alert" className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] px-4 py-3 text-sm leading-6 text-amber-100/80">
            {message}
          </p>
        ) : null}

        {config.configured ? (
          <form action={signInWithGoogle} className="mt-8">
            <button type="submit" className="button-primary w-full">
              <ShieldCheck aria-hidden="true" size={17} /> Continue with Google
            </button>
          </form>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="font-mono text-[.65rem] uppercase tracking-[.15em] text-zinc-500">Setup required</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Add the Auth.js secret, Google OAuth credentials, and administrator email allowlist in Vercel.
            </p>
          </div>
        )}

        <div className="mt-7 flex items-center gap-2 border-t border-white/[.08] pt-5 text-xs text-zinc-600">
          <ShieldCheck aria-hidden="true" size={14} /> Access is checked again before any operational data is queried.
        </div>
      </div>
    </section>
  );
}
