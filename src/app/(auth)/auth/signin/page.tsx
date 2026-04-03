import AuthShell from "@/components/auth/auth-shell";
import SignInForm from "@/components/auth/signin-form";
import type { AuthShellContent } from "@/types/types";

const signInContent: AuthShellContent = {
  eyebrow: "Schedule Us",
  title: "Welcome back. Let's move your goals forward.",
  description:
    "Track personal milestones, collaborate with your teams, and keep every target visible in one focused workspace.",
  highlights: [
    {
      title: "Real-time progress clarity",
      description:
        "See what is on track, at risk, and complete without hunting across pages.",
    },
    {
      title: "Shared planning with groups",
      description:
        "Coordinate goals with teammates and keep conversations close to execution.",
    },
    {
      title: "Fast weekly planning",
      description:
        "Start each day with priorities that are clear, measurable, and actionable.",
    },
  ],
};

const SignInPage = () => {
  return (
    <AuthShell content={signInContent}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
        <p className="text-sm text-slate-600">
          Use email and password, or continue with Google.
        </p>
      </div>

      <div className="mt-6">
        <SignInForm />
      </div>
    </AuthShell>
  );
};

export default SignInPage;
