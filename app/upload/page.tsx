// import { ViewToggle } from "@/components/view-toggle";
import ViewToggle from "@/components/view-toggle";
import { UploadForm } from "@/components/upload-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const s = await getSession();
  if (!s.isConnected || !s.mysql) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            MySQL File Manager
          </h1>
          <p className="text-slate-600">
            Upload files to MySQL database or configure database connection
          </p>
        </div>

        <ViewToggle currentView="upload" canUpload={true} />
        <UploadForm results={s.lastUploadResults} />
      </div>
    </div>
  );
}
