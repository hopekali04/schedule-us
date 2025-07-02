// components/profile/profile-modal.tsx
"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
// import { User } from "@/lib/types"; 
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  // This would be fetched from a /api/user/me endpoint in a real app
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      onClose();
      router.push('/login');
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while trying to log out.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>
            View your account details. Editing functionality coming soon.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                    <AvatarFallback className="text-2xl">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : <UserIcon />}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <p className="text-lg font-semibold">{user.name || "User Name"}</p>
                    <p className="text-sm text-muted-foreground">{user.email || "user@example.com"}</p>
                </div>
            </div>

            {/* 
            FUTURE: Add form fields here for editing profile information
            <form className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user.firstName} />
                </div>
            </form>
            */}
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
          <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
            {/* 
            FUTURE: Enable this save button when editing is implemented
            <Button type="submit" disabled>Save Changes</Button>
            */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}