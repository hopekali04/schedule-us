// components/layout/header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { PanelLeft } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  // Simple logic to generate a breadcrumb title
  const title = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="flex" >
          <PanelLeft className="h-5 w-5"/>
        </SidebarTrigger>
        <Separator orientation="vertical" className="mx-2 h-6 lg:block" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {pathname === "/" ? "Dashboard" : capitalizedTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto">
        <UserNav />
      </div>
    </header>
  );
}