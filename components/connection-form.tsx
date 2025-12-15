// // mysql-excel-file-uploader/components/connection-form.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Database, Code, Server, Shield, CheckCircle2 } from "lucide-react";
import { TEMPLATE_DB_CONNECTION } from "@/lib/templates";
import { connectAction } from "@/app/actions/connect";

type Props = { error?: string };

export function ConnectionForm({ error }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Section */}
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-6">
          {/* Connection Status */}

          {/* <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
              <Server className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Ready to connect
              </span>
            </div>
          </div> */}

          <CardTitle className="text-2xl font-bold text-slate-900">
            MySQL Database Connection
          </CardTitle>
          <CardDescription className="text-slate-600">
            Configure your MySQL database connection settings
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Template Code Accordion */}
          <div className="mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="template-code"
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline bg-slate-50/50">
                  <div className="flex items-center  gap-3">
                    {/* <Code className="w-4 h-4  text-blue-600" /> */}
                    Template Code (connection snippet)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
                    <pre className="text-sm text-slate-600 font-mono overflow-x-auto">
                      {TEMPLATE_DB_CONNECTION}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Error Message */}
          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Connection Failed
                  </h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* {error ? (
            <div className="mb-6 max-w-md mx-auto rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null} */}

          {/* Connection Form */}
          <form action={connectAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Host Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="host"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Server className="w-4 h-4 text-slate-500" />
                  Host
                </Label>

                <Input
                  id="host"
                  name="host"
                  type="text"
                  placeholder="hostname"
                  // defaultValue="127.0.0.1"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Port Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="port"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-slate-500" />
                  Port
                </Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  placeholder="3306"
                  defaultValue={3306}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500  rounded-lg"
                />
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="user"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-slate-500" />
                  Username
                </Label>
                <Input
                  id="user"
                  name="user"
                  type="text"
                  placeholder="root"
                  // defaultValue="admin"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>

              {/* Database Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="database"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-slate-500" />
                  Database
                </Label>
                <Input
                  id="database"
                  name="database"
                  type="text"
                  placeholder="dummy"
                  // defaultValue="dummy_data"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
            </div>

            {/* Password Field - Full Width */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="admin@123"
                // defaultValue="admin@123456"
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3">
                <Database className="w-5 h-5 " />
                Connect to Database
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
