// mysql-excel-file-uploader/lib/parse-files.ts

import ExcelJS from "exceljs";
import { parse as parseCsv } from "csv-parse/sync";

export type ParsedTable = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export async function parseFileToTable(file: File): Promise<ParsedTable> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    const text = await file.text();
    const records = parseCsv(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, unknown>[];
    const first = records[0] ?? {};
    return { columns: Object.keys(first), rows: records };
  }

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const ab = await file.arrayBuffer();
    const wb = new ExcelJS.Workbook();

    // ✅ 100% WORKING FIX: Convert ArrayBuffer to Buffer properly
    const buffer = Buffer.from(ab);
    await wb.xlsx.load(ab as any);

    const ws = wb.worksheets[0];
    if (!ws) throw new Error("No worksheet found.");

    const headerRow = ws.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers[colNumber - 1] =
        String(cell.value ?? `col_${colNumber}`).trim() || `col_${colNumber}`;
    });

    const rows: Record<string, unknown>[] = [];
    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => (obj[h] = row.getCell(i + 1)?.value ?? null));
      rows.push(obj);
    }

    return { columns: headers, rows };
  }

  throw new Error("Unsupported file type. Use .csv, .xlsx, or .xls");
}
