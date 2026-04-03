import AuthShell from "@/components/auth/auth-shell";
import SignUpForm from "@/components/auth/signup-form";
import type { AuthShellContent } from "@/types/types";

const signUpContent: AuthShellContent = {
  eyebrow: "Schedule Us",
  title: "Build momentum with goals that stay organized.",
  description:
    "Create your account to plan goals by category, collaborate in groups, and keep progress measurable week after week.",
  highlights: [
    {
      title: "Structure that scales",
      description:
        "Organize goals by categories and groups so priorities stay clear as work grows.",
    },
    {
      title: "Progress you can trust",
      description:
        "Track completion with transparent status indicators and clear next steps.",
    },
    {
      title: "One secure workspace",
      description:
        "Sign in with email or Google and continue where you left off on any device.",
    },
  ],
};

const SignUpPage = () => {
  return (
    <AuthShell content={signUpContent}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">
          Create account
        </h2>
        <p className="text-sm text-slate-600">
          Start with email and password or create your account with Google.
        </p>
      </div>

      <div className="mt-6">
        <SignUpForm />
      </div>
    </AuthShell>
  );
};

export default SignUpPage;
