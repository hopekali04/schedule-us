// components/dashboard/welcome-header.tsx
"use client";

interface WelcomeHeaderProps {
    // In a real app, you'd fetch the user's name from a session/context
    userName?: string | null;
}

export default function WelcomeHeader({ userName = "User" }: WelcomeHeaderProps) {
    if (!userName) {
        return
    }
    const firstName = userName.split(' ')[0];

    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome back, {firstName}! 👋
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                You&apos;re making great progress on your goals. Keep it up!
            </p>
        </div>
    );
}