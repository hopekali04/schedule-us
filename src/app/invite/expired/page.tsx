// app/invite/expired/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function ExpiredInvitePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Clock className="h-16 w-16 text-orange-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Expired</h1>
        <p className="text-gray-600 mb-6">
          This invite link has expired. Invite links are valid for 7 days for security reasons. Please contact the person who sent you this link for a new invitation.
        </p>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}