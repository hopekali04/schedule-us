// app/(app)/page.tsx
import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardData, GoalWithProgress, Group } from "@/types/types";
import { cookies } from "next/headers";

async function fetchData(path: string) {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api${path}`;
  try {
    const res = await fetch(url, {
      headers: { Cookie: `session=${session}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}`, error);
    return null;
  }
}

async function DashboardContent() {
  const [dashboardData, allGoals, allGroups] = await Promise.all([
    fetchData('/dashboard') as Promise<DashboardData | null>,
    fetchData('/goals') as Promise<GoalWithProgress[] | null>,
    fetchData('/groups') as Promise<Group[] | null>
  ]);

  if (!dashboardData || !allGoals || !allGroups) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-muted-foreground">
          Could not load dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <DashboardClient 
      initialDashboardData={dashboardData} 
      initialGoals={allGoals}
      initialGroups={allGroups}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}