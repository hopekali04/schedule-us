// components/groups/invite-modal.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Copy, CheckCircle } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export function InviteModal({ isOpen, onClose, groupId, groupName }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate invite');
      }

      setInviteLink(result.inviteLink);
      toast({
        title: 'Invite generated!',
        description: 'You can now copy and share the invite link.',
      });

    } catch (error) {
      console.error('Error generating invite:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate invite',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      toast({
        title: 'Link copied!',
        description: 'The invite link has been copied to your clipboard.',
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setEmail('');
    setInviteLink('');
    setIsCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite to {groupName}
          </DialogTitle>
          <DialogDescription>
            Generate an invite link to add new members to your group.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isGenerating || !!inviteLink}
            />
          </div>
          
          {!inviteLink ? (
            <Button 
              onClick={handleGenerateInvite} 
              disabled={isGenerating || !email}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Invite Link'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Invite link generated!</span>
                </div>
                <div className="bg-white p-2 rounded border break-all text-sm">
                  {inviteLink}
                </div>
              </div>
              
              <Button 
                onClick={handleCopyLink} 
                variant="outline" 
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                {isCopied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          )}
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="text-xs space-y-1">
              <li>• Send the generated link to the person you want to invite</li>
              <li>• They&apos;ll see group details and can accept or decline</li>
              <li>• The link expires in 7 days for security</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {inviteLink ? 'Done' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}