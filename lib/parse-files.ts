// mysql-excel-file-uploader/lib/parse-files.ts

import ExcelJS from "exceljs";
import { parse as parseCsv } from "csv-parse/sync";

export type ParsedTable = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export async function parseFileToTable(file: File): Promise<ParsedTable> {
  // ✅ Validate file exists
  if (!file || !file.name) {
    throw new Error("Invalid file: file or file name is undefined");
  }

  const name = file.name.toLowerCase();
  console.log("Parsing file:", name);

  // ✅ CSV parsing
  if (name.endsWith(".csv")) {
    const text = await file.text();
    const records = parseCsv(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, unknown>[];

    if (records.length === 0) {
      throw new Error("CSV file is empty");
    }

    const first = records[0] ?? {};
    return { columns: Object.keys(first), rows: records };
  }

  // ✅ Excel parsing (.xlsx or .xls)
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    try {
      const arrayBuffer = await file.arrayBuffer();

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("Excel file is empty or could not be read");
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error("No worksheet found in Excel file");
      }

      // ✅ FIX: Get actual column count from worksheet
      const actualColumnCount =
        worksheet.actualColumnCount || worksheet.columnCount;

      if (actualColumnCount === 0) {
        throw new Error("Worksheet has no columns");
      }

      // ✅ FIX: Read headers using values array instead of eachCell
      const headerRow = worksheet.getRow(1);
      const headers: string[] = [];

      // Read all columns based on actual column count
      for (let colIndex = 1; colIndex <= actualColumnCount; colIndex++) {
        const cell = headerRow.getCell(colIndex);
        const cellValue = cell.value;

        // Handle different cell value types
        let headerName: string;
        if (cellValue === null || cellValue === undefined) {
          headerName = `col_${colIndex}`;
        } else if (typeof cellValue === "object" && "text" in cellValue) {
          // Rich text format
          headerName = (cellValue as any).text || `col_${colIndex}`;
        } else {
          headerName = String(cellValue).trim() || `col_${colIndex}`;
        }

        headers.push(headerName);
      }

      console.log(`Found ${headers.length} headers:`, headers);

      if (headers.length === 0) {
        throw new Error("No columns found in Excel file");
      }

      // ✅ Extract data rows (starting from row 2)
      const rows: Record<string, unknown>[] = [];
      const actualRowCount = worksheet.actualRowCount || worksheet.rowCount;

      for (let rowIndex = 2; rowIndex <= actualRowCount; rowIndex++) {
        const row = worksheet.getRow(rowIndex);
        const rowData: Record<string, unknown> = {};

        headers.forEach((header, colIndex) => {
          const cell = row.getCell(colIndex + 1);
          const cellValue = cell.value;

          // Handle different cell value types
          if (cellValue === null || cellValue === undefined) {
            rowData[header] = null;
          } else if (typeof cellValue === "object" && "text" in cellValue) {
            // Rich text format
            rowData[header] = (cellValue as any).text;
          } else if (typeof cellValue === "object" && "result" in cellValue) {
            // Formula result
            rowData[header] = (cellValue as any).result;
          } else {
            rowData[header] = cellValue;
          }
        });

        rows.push(rowData);
      }

      console.log(
        `Parsed Excel: ${headers.length} columns, ${rows.length} rows`
      );

      return { columns: headers, rows };
    } catch (error) {
      console.error("Excel parsing error:", error);
      throw new Error(
        `Failed to parse Excel file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  throw new Error(
    `Unsupported file type: ${name}. Only .csv, .xlsx, or .xls files are supported`
  );
}
