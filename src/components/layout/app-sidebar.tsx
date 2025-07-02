// components/layout/app-sidebar.tsx
"use client";

import { Home, Plus, Search, Sparkles, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavMain } from "./nav-main";
import { NavGroups } from "./nav-groups";
import { Button } from "../ui/button";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import GoalModal from "@/components/goals/goal-modal";
import GroupModal from "@/components/groups/group-modal";
import { useState } from "react";
import { Group } from "@/types/types";
import { Target } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]); // To pass to GoalModal

  const navMain = [
    { title: "Dashboard", url: "/", icon: Home, isActive: pathname === "/" },
    { title: "Search", url: "#", icon: Search },
    { title: "Ask AI", url: "#", icon: Sparkles },
    { title: "Groups", url: "/groups", icon: Users },
  ];

  return (
    <>
        <GoalModal isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)} groups={groups} />
        <GroupModal isOpen={isGroupModalOpen} onClose={() => setGroupModalOpen(false)} />
        <Sidebar className="border-r"
         collapsible="icon"
         {...props}
         >
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">GoalTracker</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col">
            <div className="p-2">
              <NavMain items={navMain} />
              <Button variant="default" className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => setGoalModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Goal
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavGroups onAddGroup={() => setGroupModalOpen(true)} onGroupsLoad={setGroups}/>
            </div>
          </SidebarContent>
        </Sidebar>
    </>
  );
}