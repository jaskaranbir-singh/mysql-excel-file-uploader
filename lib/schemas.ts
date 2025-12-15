// mysql-excel-file-uploader/lib/schemas.ts

import { z } from "zod";

export const ConnectionSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().int().min(1).max(65535).default(3306),
  user: z.string().min(1),
  password: z.string().optional().default(""),
  database: z.string().min(1),
});
export type ConnectionInput = z.infer<typeof ConnectionSchema>;

export type UploadFileResult =
  | { fileName: string; ok: true; tableName: string; insertedRows: number }
  | { fileName: string; ok: false; message: string };
