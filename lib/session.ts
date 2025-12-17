// mysql-excel-file-uploader/lib/session.ts

import {
  getIronSession,
  type IronSession,
  type SessionOptions,
} from "iron-session";
import { cookies } from "next/headers";
import type { UploadFileResult } from "@/lib/schemas";

export type SessionData = {
  isConnected: boolean;
  mysql?: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  lastUploadResults?: UploadFileResult[];
  lastError?: string;
};

function mustGetSessionPassword(): string {
  const pw = process.env.SESSION_PASSWORD;
  if (!pw || pw.trim().length < 32) {
    throw new Error(
      "SESSION_PASSWORD is missing or too short (32+ chars). Set it in Vercel Environment Variables and/or .env.local."
    );
  }
  return pw.trim();
}

// ✅ no export const sessionOptions (prevents build-time crash)
function getSessionOptions(): SessionOptions {
  return {
    cookieName: "mysql-uploader-session",
    password: mustGetSessionPassword(),
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    },
  };
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const store = await cookies(); // Next 16 ok
  return getIronSession<SessionData>(store, getSessionOptions());
}
