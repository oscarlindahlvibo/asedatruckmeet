import { getCurrentUser } from "@/lib/auth";
import type { Role } from "@prisma/client";

export async function requireAdminRole(roles: Role[] = ["SUPER_ADMIN", "EVENT_ADMIN"]) {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "UNAUTHENTICATED" as const };
  if (!user.roles.some((role) => roles.includes(role))) return { user: null, error: "FORBIDDEN" as const };
  return { user, error: null };
}
