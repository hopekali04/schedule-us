// app/invite/[token]/InvitePageClient.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Users, Mail, Calendar } from 'lucide-react';

interface InviteData {
  group: {
    id: string;
    name: string;
    description?: string;
  };
  email: string;
  inviteId: string;
}

interface InvitePageClientProps {
  inviteData: InviteData;
  token: string;
}

export function InvitePageClient({ inviteData }: InvitePageClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleAction = async (action: 'accept' | 'decline') => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId: inviteData.inviteId,
          action,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process invite');
      }

      toast({
        title: action === 'accept' ? 'Welcome to the team!' : 'Invite declined',
        description: result.message,
      });

      setShowDialog(false);

      // Redirect based on action
      if (action === 'accept' && result.groupId) {
        router.push(`/groups/${result.groupId}`);
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Error processing invite:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process invite',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Invitation
            </DialogTitle>
            <DialogDescription>
              You&apos;ve been invited to join a group on ScheduleUs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-lg text-gray-900">{inviteData.group.name}</h3>
              {inviteData.group.description && (
                <p className="text-gray-600 mt-1">{inviteData.group.description}</p>
              )}
              
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Invited: {inviteData.email}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Join and start collaborating on goals together</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p>By accepting this invitation, you&apos;ll be able to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>View and collaborate on group goals</li>
                <li>Participate in team discussions</li>
                <li>Track progress together</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleAction('decline')}
              disabled={isProcessing}
            >
              Decline
            </Button>
            <Button
              onClick={() => handleAction('accept')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Accept & Join'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}