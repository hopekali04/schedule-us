// components/dashboard/stat-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    Icon: LucideIcon;
    gradient: string; // e.g., "from-blue-500 to-blue-600"
}

export default function StatCard({ title, value, Icon, gradient }: StatCardProps) {
    return (
        <Card className={`text-white border-0 bg-gradient-to-br ${gradient}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium opacity-80">{title}</p>
                        <p className="text-4xl font-bold">{value}</p>
                    </div>
                    <Icon className="h-10 w-10 opacity-70" />
                </div>
            </CardContent>
        </Card>
    )
}