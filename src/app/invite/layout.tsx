// app/invite/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Group Invitation - ScheduleUs",
  description: "Join a team on ScheduleUs",
};

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}