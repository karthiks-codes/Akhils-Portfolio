import { handlers } from "@/auth";
import { isAdminAuthConfigured } from "@/lib/auth/admin";

export const runtime = "nodejs";

function unavailable() {
  return Response.json({ message: "Admin authentication is not configured." }, { status: 503 });
}

export const GET = isAdminAuthConfigured() ? handlers.GET : unavailable;
export const POST = isAdminAuthConfigured() ? handlers.POST : unavailable;
