// app/(app)/groups/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { Group } from "@/types/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// This server component fetches the data directly.
async function getGroups(): Promise<Group[] | null> {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/groups`;
    try {
        const res = await fetch(url, {
            headers: { Cookie: `session=${session}` },
            cache: 'no-store' // Ensure we get the latest list of groups
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch ${url}`, error);
        return null;
    }
}

export default async function GroupsPage() {
    const groups = await getGroups();

    if (!groups) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <p className="text-lg text-muted-foreground">Could not load your groups. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Your Groups</h2>
                    <p className="mt-1 text-md text-gray-600">
                        Collaborate on shared goals with your teams and communities.
                    </p>
                </div>
                {/* 
                    NOTE: The "New Group" button is in the sidebar, but we could add one here too
                    if desired, which would trigger the GroupModal.
                */}
            </div>

            {groups.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {groups.map((group) => (
                        <Card key={group.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            <Users className="h-6 w-6"/>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {group.name === '<self>' ? 'Personal Goals' : group.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {group.name === '<self>' ? 'Your private space for personal objectives.' : group.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                {/* Future content: You could show member avatars or goal counts here */}
                                <p className="text-sm text-muted-foreground">Created on: {new Date(group.createdAt as Date).toLocaleDateString()}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/groups/${group.id}`}>
                                        View Goals <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">You&apos;re not in any groups yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a new group to start collaborating on goals.</p>
                    <div className="mt-6">
                        {/* This button would need to be wired up to a client component to open the modal */}
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Create New Group
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}