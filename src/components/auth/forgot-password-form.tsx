"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseConfig";
import { authToast } from "@/lib/auth-toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      authToast.success("Reset link sent. Check your inbox and spam folder.");
    } catch {
      authToast.error(
        "Unable to send reset email right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
            disabled={isLoading}
            required
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLoading ? "Sending reset link..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Remembered your password?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-cyan-700 hover:text-cyan-800"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
