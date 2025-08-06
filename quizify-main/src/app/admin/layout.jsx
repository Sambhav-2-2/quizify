"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Fixed condition to properly check for admin access
  if (status === "unauthenticated" || session?.user?.accountType !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <h2 className="font-semibold">Admin Dashboard</h2>
            </div>
            <nav className="flex-1 overflow-auto py-2">
              <div className="px-3 py-2">
                <h3 className="mb-2 text-sm font-medium">Exams</h3>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/admin/list"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      All Exams
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin"
                      className="block rounded-md px-3 py-2 text-sm font-medium bg-accent"
                    >
                      Create Exam
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <Button className="rounded-1 mx-2 mb-1" onClick={()=> signOut()}>Sign out</Button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
