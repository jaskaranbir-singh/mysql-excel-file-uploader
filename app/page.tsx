// mysql-excel-file-uploader/app/page.tsx

import ViewToggle from "@/components/view-toggle";
import { ConnectionForm } from "@/components/connection-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

export default async function Page() {
  const s = await getSession();

  // if already connected, go to upload
  if (s.isConnected && s.mysql) redirect("/upload");

  // ✅ add these two lines
  const developerUrl =
    process.env.NEXT_PUBLIC_DEVELOPER_URL ||
    "https://www.jaskaranbir-singh.com";
  const developerLabel = process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Developer";

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

        <ViewToggle currentView="connection" canUpload={false} />
        <ConnectionForm error={s.lastError} />
      </div>

      {/* ✅ change Footer call */}
      <Footer developerUrl={developerUrl} developerLabel={developerLabel} />
    </div>
  );
}
