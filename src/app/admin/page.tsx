import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerIsAdmin, getServerUser } from "@/lib/supabase/server";
import AdminPanelClient from "./AdminPanelClient";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage Outskyz content, pricing and orders.",
  robots: { index: false, follow: false },
};

/**
 * Server-guarded admin route.
 *
 * Previously this page was `"use client"` and only checked `isAdmin` in the
 * browser, so the entire admin bundle — and a "Loading…" shell — was shipped to
 * every visitor before any redirect happened.
 *
 * The real check now runs on the server using `getUser()` (which revalidates
 * the JWT against the auth server) before any admin code is sent to the client.
 * `src/proxy.ts` performs the same check at the edge; this is defence in depth
 * so the guard holds even if the proxy matcher changes.
 */
export default async function AdminPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const isAdmin = await getServerIsAdmin();
  if (!isAdmin) {
    redirect("/");
  }

  return <AdminPanelClient />;
}
