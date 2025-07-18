/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(app)/groups/[groupId]/GroupPageClient.tsx
"use client";

import { useState } from 'react';
import { Group, GoalWithProgress, Categories } from '@/types/types';
import GoalCard from '@/components/goals/goal-card';
import GoalPreviewModal from '@/components/goals/goal-preview-modal';
import GoalModal from '@/components/goals/goal-modal';
import ChatRoom from '@/components/chat/chat-room';
import { InviteModal } from '@/components/groups/invite-modal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {  Settings, Plus, Mail, MessageCircle, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GroupPageClientProps {
  initialGroup: Group;
  initialGoals: GoalWithProgress[];
  initialCategories: Categories[]; 
}

export default function GroupPageClient({ initialGroup, initialGoals, initialCategories }: GroupPageClientProps) {
    const [group, setGroup] = useState(initialGroup);
    const [goals, setGoals] = useState(initialGoals);
    const [previewingGoal, setPreviewingGoal] = useState<GoalWithProgress | null>(null);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<GoalWithProgress | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const router = useRouter();

    const handleOpenNewGoalModal = () => {
        setEditingGoal(null);
        setIsGoalModalOpen(true);
    };
    
    const handleOpenEditGoalModal = (goal: GoalWithProgress) => {
        setPreviewingGoal(null); // Close preview if it's open
        setEditingGoal(goal);
        setIsGoalModalOpen(true);
    };

    const onModalClose = () => {
        setIsGoalModalOpen(false);
        // Refresh the entire page's data from the server
        router.refresh(); 
    };

    const activeGoals = goals.filter(g => g.status !== 'Completed' && g.status !== 'Closed');
    const completedGoals = goals.filter(g => g.status === 'Completed' || g.status === 'Closed');

    return (
        <>
            <GoalModal 
                isOpen={isGoalModalOpen} 
                onClose={onModalClose} 
                goal={editingGoal} 
                categories={initialCategories}
                groups={[group]} // Pass only the current group to the modal
            />
            <GoalPreviewModal 
                goal={previewingGoal} 
                onClose={() => setPreviewingGoal(null)} 
                onEdit={handleOpenEditGoalModal} 
            />
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                groupId={group.id}
                groupName={group.name === '<self>' ? 'Personal Goals' : group.name}
            />

            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Header Section */}
                <div className="p-6 bg-white border rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                {group.name === '<self>' ? 'Personal Goals' : group.name}
                            </h2>
                            <p className="mt-1 text-md text-gray-600">
                                {group.name === '<self>' ? 'Your private space for personal objectives.' : group.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                            {group.name !== '<self>' && (
                                <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                                    <Mail className="mr-2 h-4 w-4" /> Invite
                                </Button>
                            )}
                            <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>

                {/* Main Content with Tabs */}
                <Tabs defaultValue="goals" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="goals" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Goals
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Chat
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="goals" className="space-y-8">
                        {/* Active Goals Section */}
                        <div>
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-2xl font-semibold text-gray-900">Active Goals</h3>
                                <Button onClick={handleOpenNewGoalModal} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-4 w-4" /> New Goal for this Group
                                </Button>
                            </div>
                            {activeGoals.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {activeGoals.map((goal) => (
                                        <GoalCard key={goal.id} goal={goal} onClick={() => setPreviewingGoal(goal)} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900">No active goals here!</h3>
                                    <p className="mt-1 text-sm text-gray-500">Create a new goal to get this group started.</p>
                                </div>
                            )}
                        </div>

                        {/* Completed Goals Section */}
                        {completedGoals.length > 0 && (
                             <div>
                                <div className="pb-4">
                                    <h3 className="text-2xl font-semibold text-gray-900">Completed Goals</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {completedGoals.map((goal) => (
                                        <GoalCard key={goal.id} goal={goal} onClick={() => setPreviewingGoal(goal)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="chat">
                        <ChatRoom 
                            groupId={group.id} 
                            groupName={group.name === '<self>' ? 'Personal Goals' : group.name}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}