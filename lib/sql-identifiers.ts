// mysql-excel-file-uploader/lib/sql-identifiers.ts
export function sanitizeIdentifier(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return cleaned || "table_1";
}

export function assertSafeIdentifier(id: string): string {
  if (!/^[a-z0-9_]+$/i.test(id)) throw new Error(`Unsafe identifier: ${id}`);
  return id;
}

export function qid(id: string): string {
  return `\`${assertSafeIdentifier(id)}\``;
}

export function makeUniqueColumns(cols: string[]): string[] {
  const seen = new Map<string, number>();
  return cols.map((c, idx) => {
    const base = sanitizeIdentifier(String(c || "")) || `col_${idx + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
}
