"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function disconnectAction(): Promise<void> {
  const s = await getSession();
  s.isConnected = false;
  s.mysql = undefined;
  s.lastError = undefined;
  await s.save();
  redirect("/");
}
