"use client";
import Link from "next/link";
import { Upload, Database } from "lucide-react";

export type ViewToggleProps = {
  currentView: "connection" | "upload";
  canUpload: boolean;
};

export default function ViewToggle({
  currentView,
  canUpload,
}: ViewToggleProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Navigation Header */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-2">
          {/* LEFT: Database Connection */}
          <Link
            href="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === "connection"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Database Connection
          </Link>

          {/* RIGHT: Upload Files */}
          {canUpload ? (
            <Link
              href="/upload"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "upload"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Files
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-md text-sm font-medium opacity-50 cursor-not-allowed text-slate-600">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Files
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
