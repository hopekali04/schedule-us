// app/(app)/groups/[groupId]/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Group, GoalWithProgress, Categories } from '@/types/types';

import GroupPageClient from './GroupPageClient';

interface PageProps {
  params: Promise<{
    groupId: string;
  }>;
}

// Fetch all data for the group on the server
async function getGroupData(groupId: string): Promise<{ group: Group; goals: GoalWithProgress[], categories: Categories[] } | null> {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;

    try {
        const [groupRes, goalsRes, categoryRes] = await Promise.all([
            // TODO: have an endpoint `/api/groups/${groupId}`
            // For now, we fetch all groups and filter.
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/groups`, { headers: { Cookie: `session=${session}` }, cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals`, { headers: { Cookie: `session=${session}` }, cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { headers: { Cookie: `session=${session}` }, cache: 'no-store' })
        ]);

        if (!groupRes.ok || !goalsRes.ok || !categoryRes.ok) return null;

        const allGroups: Group[] = await groupRes.json();
        const allGoals: GoalWithProgress[] = await goalsRes.json();
        const allCategories: Categories[] = await categoryRes.json();
        
        const group = allGroups.find(g => g.id === groupId);
        if (!group) return null; // User may not have access or group doesn't exist

        const goals = allGoals.filter(g => g.groupId === groupId);

        return { group, goals, categories: allCategories };

    } catch (error) {
        console.error('Failed to fetch group data', error);
        return null;
    }
}


export default async function GroupDetailPage({ params }: PageProps) {
    // Await the params since it's now a Promise
    const { groupId } = await params;
    const data = await getGroupData(groupId);
    
    if (!data) {
        // This will render the 404 page if the group is not found or user lacks access.
        notFound();
    }

    const { group, goals, categories } = data;

    return (
        <GroupPageClient initialGroup={group} initialGoals={goals} initialCategories={categories} />
    );
}