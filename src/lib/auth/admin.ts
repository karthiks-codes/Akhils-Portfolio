import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAuthConfig } from "@/lib/env";
import { isAdminEmail } from "@/lib/auth/policy";

export function isAdminAuthConfigured() {
  return getAuthConfig().configured;
}

export const requireAdmin = cache(async () => {
  const config = getAuthConfig();
  if (!config.configured) redirect("/admin/login?error=configuration");

  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email, config.adminEmails)) {
    redirect("/admin/login");
  }

  return {
    email: session.user.email,
    name: session.user.name ?? "Administrator",
    image: session.user.image ?? null,
  };
});
