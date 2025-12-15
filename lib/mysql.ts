// lib/mysql.ts

import mysql, { type Pool } from "mysql2/promise";
import crypto from "crypto";
import type { ConnectionInput } from "@/lib/schemas";

const poolCache = new Map<string, Pool>();

function keyOf(c: ConnectionInput): string {
  return crypto
    .createHash("sha256")
    .update(`${c.host}:${c.port}:${c.user}:${c.password ?? ""}:${c.database}`)
    .digest("hex");
}

export function getPool(conn: ConnectionInput): Pool {
  const key = keyOf(conn);

  const existing = poolCache.get(key);
  if (existing) return existing;

  const pool = mysql.createPool({
    host: conn.host,
    port: conn.port,
    user: conn.user,
    password: conn.password ?? "",
    database: conn.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  });

  poolCache.set(key, pool);
  return pool;
}
