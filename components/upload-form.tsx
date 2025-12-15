// // // components/upload-form.tsx

"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Link as LinkIcon,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Trash2,
  ArrowLeft,
  Sun,
  Moon,
  ArrowRight,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  File,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { uploadAction } from "@/app/actions/upload";
import { disconnectAction } from "@/app/actions/disconnect";
// import { TEMPLATE_PROCESS_MESSAGE } from "@/lib/templates";
import type { UploadFileResult } from "@/lib/schemas";

type Props = { results?: UploadFileResult[] };

type PickedFile = { id: string; file: File };

function fileId(f: File) {
  return `${f.name}|${f.size}|${f.lastModified}`;
}

function syncInputFiles(input: HTMLInputElement | null, files: PickedFile[]) {
  if (!input) return;
  const dt = new DataTransfer();
  for (const pf of files) dt.items.add(pf.file);
  input.files = dt.files; // ✅ real FileList updated (so remove works)
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
    >
      <Upload className="w-5 h-5 mr-2" />
      {pending ? "Uploading..." : "Upload Files"}
    </Button>
  );
}

function UploadBody({
  picked,
  onPick,
  onRemove,
  inputRef,
}: {
  picked: PickedFile[];
  onPick: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="mb-8">
        <Label className="text-lg font-semibold text-slate-900 mb-4 block">
          Upload Files:
        </Label>

        <div
          className={`border-2 border-dashed border-slate-300 rounded-lg p-8 text-center transition-colors bg-slate-50/50 ${
            pending ? "opacity-70 pointer-events-none" : "hover:border-blue-400"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            id="file-upload"
            name="files"
            multiple
            accept=".csv,.xlsx,.xls"
            className="hidden"
            disabled={pending}
            onClick={(e) => {
              // allow picking the same file again
              (e.currentTarget as HTMLInputElement).value = "";
            }}
            onChange={(e) => onPick(e.currentTarget.files)}
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-slate-700 font-medium mb-2">
              Click to select files or drag and drop
            </span>
            <span className="text-sm text-slate-500">
              You can select CSV or Excel files
            </span>
            <span className="text-sm text-slate-500 mt-1">
              File name will be used as table name
            </span>
          </label>
        </div>

        {/* Selected files list + remove (disabled while uploading) */}
        {picked.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium text-slate-700 mb-2">
              Selected Files ({picked.length}):
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {picked.map(({ id, file }) => (
                <div
                  key={id}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {file.name.toLowerCase().endsWith(".csv") ? (
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                    <span className="truncate font-medium text-slate-700">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => onRemove(id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <SubmitButton disabled={picked.length === 0} />
      </div>
    </>
  );
}

export function UploadForm({ results }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<PickedFile[]>([]);

  const onPick = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const incoming: PickedFile[] = Array.from(files).map((f) => ({
      id: fileId(f),
      file: f,
    }));

    // merge unique
    const map = new Map<string, PickedFile>(picked.map((p) => [p.id, p]));
    for (const it of incoming) map.set(it.id, it);

    const next = Array.from(map.values());
    setPicked(next);
    syncInputFiles(inputRef.current, next);
  };

  const onRemove = (id: string) => {
    const next = picked.filter((p) => p.id !== id);
    setPicked(next);
    syncInputFiles(inputRef.current, next);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Upload File to MySQL
        </CardTitle>
        <CardDescription className="text-slate-600">
          Select CSV or Excel files to upload to your MySQL database
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {/* <div className="mb-8">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Template Code (with message processing logic)
          </Label>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <pre className="text-sm text-slate-600 font-mono overflow-x-auto">
              {TEMPLATE_PROCESS_MESSAGE}
            </pre>
          </div>
        </div> */}

        {/* ✅ Server Action form (NO encType / method props) */}
        <form
          action={async (formData: FormData) => {
            await uploadAction(formData);
          }}
        >
          <UploadBody
            picked={picked}
            onPick={onPick}
            onRemove={onRemove}
            inputRef={inputRef}
          />
        </form>

        {results?.length ? (
          <div className="mt-8 space-y-2">
            {results.map((r) => (
              <div
                key={r.fileName}
                className={`rounded-lg border p-3 text-sm ${
                  r.ok
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  {r.fileName.toLowerCase().endsWith(".csv") ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                  )}
                  {r.fileName}
                </div>
                {r.ok ? (
                  <div>
                    Inserted <b>{r.insertedRows}</b> rows into table{" "}
                    <b>{r.tableName}</b>
                  </div>
                ) : (
                  <div>{r.message}</div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* ✅ Correct redirect button to DB connection */}
        <div className="text-center mt-8">
          {results?.some((r) => r.ok) ? (
            <form action={disconnectAction} className="inline-block">
              <Button
                type="submit"
                variant="outline"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm px-6 py-2 rounded-lg transition-colors border-blue-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Database Connection
                {/* <ChevronRight className="w-4 h-4 ml-1" /> */}
              </Button>
            </form>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
