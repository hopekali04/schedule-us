"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import type { AuthFeedback } from "@/types/types";
import GoogleIcon from "./google-icon";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const router = useRouter();
  const provider = useMemo(() => new GoogleAuthProvider(), []);

  const createSession = async (idToken: string) => {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create session");
    }
  };

  const resolveFirebaseError = (error: unknown, fallback: string) => {
    if (!error || typeof error !== "object" || !("code" in error)) {
      return fallback;
    }

    const code = String(error.code);
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again in a few minutes.";
      case "auth/popup-closed-by-user":
        return "Google sign in was cancelled before completion.";
      case "auth/popup-blocked":
        return "Popup was blocked. Please allow popups and try again.";
      default:
        return fallback;
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      await createSession(idToken);
      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: resolveFirebaseError(
          error,
          "Unable to sign in right now. Please try again.",
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFeedback(null);
    setIsGoogleLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: resolveFirebaseError(
          error,
          "Google sign in failed. Please try again.",
        ),
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setFeedback(null);

    if (!email) {
      setFeedback({
        type: "info",
        message: "Enter your email first, then use Reset password again.",
      });
      return;
    }

    setIsResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback({
        type: "success",
        message: "Password reset link sent. Check your inbox and spam folder.",
      });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: resolveFirebaseError(
          error,
          "Unable to send reset email. Please try again.",
        ),
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  const isBusy = isLoading || isGoogleLoading || isResetLoading;

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isBusy}
            autoComplete="email"
            placeholder="m@example.com"
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isBusy}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={isBusy}
          className="text-sm font-medium text-cyan-700 hover:text-cyan-800 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {isResetLoading ? "Sending reset link..." : "Reset password"}
        </button>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Open reset page
        </Link>
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
          <p>{feedback.message}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isBusy}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isBusy}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <p className="text-center text-sm text-slate-600">
        New here?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-cyan-700 hover:text-cyan-800"
        >
          Create an account
        </Link>
      </p>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Use your work email for shared goals and groups.</span>
      </div>
    </form>
  );
};

export default SignInForm;
