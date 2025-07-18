// app/(app)/layout.tsx
import type { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "GoalTracker",
  description: "Developed by Hop",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-gray-50/50">
            <AppSidebar />
            <SidebarInset className="flex-1 w-full">
              <div className="flex flex-col h-full w-full">
                <AppHeader />
                <Toaster />
                <main className="flex-1 overflow-y-auto w-full">
                  {children}
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>  
      </body>
    </html>
  );
}