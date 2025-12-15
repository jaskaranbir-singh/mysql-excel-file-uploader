// app/actions/connect.ts
"use server";

import mysql from "mysql2/promise";
import { redirect } from "next/navigation";
import { ConnectionSchema } from "@/lib/schemas";
import { getSession } from "@/lib/session";

function normalizeHost(input: string): string {
  const v = input.trim();
  const noProto = v.replace(/^https?:\/\//i, "");
  return noProto.split(":")[0].trim();
}

function isHostAllowed(host: string): boolean {
  const list = process.env.ALLOWED_DB_HOSTS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!list || list.length === 0) return true;
  return list.includes(host);
}

function isNextRedirectError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function connectAction(formData: FormData): Promise<void> {
  const raw = {
    host: normalizeHost(String(formData.get("host") ?? "")),
    port: String(formData.get("port") ?? "3306").trim(),
    user: String(formData.get("user") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    database: String(formData.get("database") ?? "").trim(),
  };

  const parsed = ConnectionSchema.safeParse(raw);
  if (!parsed.success) {
    const s = await getSession();
    s.isConnected = false;
    s.mysql = undefined;
    s.lastError = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(" | ");
    await s.save();
    redirect("/");
  }

  const conn = parsed.data;

  if (!isHostAllowed(conn.host)) {
    const s = await getSession();
    s.isConnected = false;
    s.mysql = undefined;
    s.lastError = `Host not allowed: ${conn.host}`;
    await s.save();
    redirect("/");
  }

  try {
    const c = await mysql.createConnection({
      host: conn.host,
      port: conn.port,
      user: conn.user,
      password: conn.password,
      database: conn.database,
    });

    await c.query("SELECT 1");
    await c.end();

    const s = await getSession();
    s.isConnected = true;
    s.mysql = conn;
    s.lastError = undefined;
    await s.save();
  } catch (e) {
    // IMPORTANT: never swallow redirect errors
    if (isNextRedirectError(e)) throw e;

    const s = await getSession();
    s.isConnected = false;
    s.mysql = undefined;
    s.lastError = e instanceof Error ? e.message : "Connection failed";
    await s.save();
    redirect("/");
  }

  // redirect OUTSIDE try/catch so it isn't caught
  redirect("/upload");
}
