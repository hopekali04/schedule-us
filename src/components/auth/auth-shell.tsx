import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { AuthShellContent } from "@/types/types";

interface AuthShellProps {
  content: AuthShellContent;
  children: ReactNode;
}

export default function AuthShell({ content, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 px-6 py-10 md:grid-cols-2 md:items-center md:gap-8 lg:px-12">
        <section className="mb-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur md:mb-0 md:p-10">
          <div className="mb-8 flex items-center gap-2">
            <p className="text-sm font-medium text-cyan-100">
              {content.eyebrow}
            </p>
          </div>

          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            {content.title}
          </h1>
          <p className="mt-4 text-sm text-slate-100 md:text-base">
            {content.description}
          </p>

          <ul className="mt-8 space-y-4">
            {content.highlights.map((highlight) => (
              <li
                key={highlight.title}
                className="flex items-start gap-3 rounded-xl bg-white/10 p-3"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 text-emerald-200"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {highlight.title}
                  </p>
                  <p className="text-sm text-slate-200">
                    {highlight.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
