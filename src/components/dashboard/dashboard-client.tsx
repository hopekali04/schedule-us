// components/dashboard/dashboard-client.tsx
"use client";

import { useState } from "react";
import { Plus, Target, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Categories, DashboardData, GoalWithProgress, Group, User } from "@/types/types";
import { Button } from "@/components/ui/button";
import StatCard from "./stat-card";
import GoalCard from "@/components/goals/goal-card";
import GoalModal from "@/components/goals/goal-modal";
import GoalPreviewModal from "@/components/goals/goal-preview-modal";
import GroupModal from "@/components/groups/group-modal";
import WelcomeHeader from "./welcome-header";
import QuickActions from "./quick-actions";
import ChartsGrid from "./charts-grid";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  initialDashboardData: DashboardData;
  initialGoals: GoalWithProgress[];
  initialGroups: Group[];
  initialCategories: Categories[];
  currentUser: User | null;
}

export function DashboardClient({ initialDashboardData, initialGoals, initialGroups, initialCategories, currentUser }: DashboardClientProps) {
  const [dashboardData] = useState(initialDashboardData);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalWithProgress | null>(null);
  const [previewingGoal, setPreviewingGoal] = useState<GoalWithProgress | null>(null);
  const router = useRouter();

  const handleOpenNewGoalModal = () => { setEditingGoal(null); setIsGoalModalOpen(true); };
  const handleOpenEditGoalModal = (goal: GoalWithProgress) => { setPreviewingGoal(null); setEditingGoal(goal); setIsGoalModalOpen(true); };
  const onModalClose = () => { 
    setIsGoalModalOpen(false); 
    setIsGroupModalOpen(false);
    router.refresh(); 
  };
  const UserMail = currentUser?.email || "User";

  const activeGoals = initialGoals.filter(g => g.status !== 'Completed' && g.status !== 'Closed');

  return (
    <>
      <GoalModal isOpen={isGoalModalOpen} onClose={onModalClose} goal={editingGoal} groups={initialGroups} categories={initialCategories} />
      <GoalPreviewModal goal={previewingGoal} onClose={() => setPreviewingGoal(null)} onEdit={handleOpenEditGoalModal} />
      <GroupModal isOpen={isGroupModalOpen} onClose={onModalClose} />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <WelcomeHeader userName={UserMail} />
        
        {/* <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="mt-1 text-md text-gray-600">Here&apos;s an overview of your progress. Keep pushing forward!</p>
        </div> */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="In Progress" 
            value={dashboardData.stats.inProgressGoals} 
            Icon={Target} 
            gradient="from-blue-500 to-sky-500" 
          />
          <StatCard 
            title="Completed" 
            value={dashboardData.stats.completedGoals} 
            Icon={CheckCircle} 
            gradient="from-green-500 to-emerald-500" 
          />
          <StatCard 
            title="Groups" 
            value={initialGroups.length} 
            Icon={Users} 
            gradient="from-purple-500 to-violet-500" 
          />
          <StatCard 
            title="Overall Progress" 
            value={`${dashboardData.stats.overallProgressPercentage}%`} 
            Icon={TrendingUp} 
            gradient="from-orange-500 to-amber-500" 
          />
        </div>

        <QuickActions
          onCreateGoal={handleOpenNewGoalModal}
          onJoinGroup={() => setIsGroupModalOpen(true)}
          goals={initialGoals}
        />

        <div>
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-2xl font-semibold text-gray-900">Active Goals</h3>
            <Button onClick={handleOpenNewGoalModal} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </div>
          {activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activeGoals.map((goal) => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onClick={() => setPreviewingGoal(goal)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">No active goals yet!</h3>
              <p className="mt-1 text-sm text-gray-500">Create a new goal to get started on your journey.</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700" 
                onClick={handleOpenNewGoalModal}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Goal
              </Button>
            </div>
          )}
        </div>

        <ChartsGrid goals={initialGoals} />
      </div>
    </>
  );
}