// mysql-excel-file-uploader/app/actions/upload.ts

"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/mysql";
import { parseFileToTable } from "@/lib/parse-files";
import {
  makeUniqueColumns,
  qid,
  sanitizeIdentifier,
} from "@/lib/sql-identifiers";
import type { UploadFileResult } from "@/lib/schemas";

function toCell(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v);
}

// export async function uploadAction(formData: FormData): Promise<void> {
export async function uploadAction(formData: FormData) {
  const s = await getSession();
  if (!s.isConnected || !s.mysql) redirect("/");

  // ✅ MULTI-FILE (correct)
  const files = formData
    .getAll("files")
    .filter((x): x is File => x instanceof File);

  if (files.length === 0) {
    s.lastUploadResults = [
      { fileName: "(all)", ok: false, message: "No files uploaded." },
    ];
    await s.save();
    redirect("/upload");
  }

  const pool = getPool(s.mysql);
  const results: UploadFileResult[] = [];

  for (const file of files) {
    try {
      const tableName = sanitizeIdentifier(file.name);
      const parsed = await parseFileToTable(file);

      const rawCols = parsed.columns;
      const cols = makeUniqueColumns(rawCols);
      if (cols.length === 0) throw new Error("No columns found.");

      const colDefs = cols.map((c) => `${qid(c)} TEXT NULL`).join(", ");
      await pool.query(
        `CREATE TABLE IF NOT EXISTS ${qid(tableName)} (${colDefs})`
      );

      const rows = parsed.rows.map((r) =>
        cols.map((c, i) => toCell((r as any)[rawCols[i]]))
      );
      const nonEmpty = rows.filter((arr) =>
        arr.some((x) => x !== null && x !== "")
      );

      if (nonEmpty.length === 0) {
        results.push({
          fileName: file.name,
          ok: true,
          tableName,
          insertedRows: 0,
        });
        continue;
      }

      const sql = `INSERT INTO ${qid(tableName)} (${cols.map(qid).join(", ")}) VALUES ?`;
      const [res] = await pool.query(sql, [nonEmpty]);
      const inserted =
        typeof (res as any).affectedRows === "number"
          ? (res as any).affectedRows
          : nonEmpty.length;

      results.push({
        fileName: file.name,
        ok: true,
        tableName,
        insertedRows: inserted,
      });
    } catch (e) {
      results.push({
        fileName: file.name,
        ok: false,
        message: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }
  s.lastUploadResults = results;
  await s.save();
  return results;
}
