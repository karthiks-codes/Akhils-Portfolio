export function isAdminEmail(email: string | null | undefined, allowlist: readonly string[]) {
  return Boolean(email && allowlist.includes(email.trim().toLowerCase()));
}
