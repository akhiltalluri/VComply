"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { storeAuthState, isAuthenticated } from "@/lib/auth";
import { PageContainer } from "@/components/layout/PageContainer";
import { getApiErrorMessage, login } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M12 3 4.5 6v5.2c0 4.7 2.8 8.8 7.5 10.8 4.7-2 7.5-6.1 7.5-10.8V6z" />
      <path d="M12 8v4m0 3h.01" />
    </svg>
  );
}

const workspaceSignals = [
  {
    title: "Assessment workspace",
    description: "Review submitted company profiles, regulatory exposure, and recommended controls.",
  },
  {
    title: "Regulatory intelligence",
    description: "Inspect the laws driving risk classification and understand why they apply.",
  },
  {
    title: "Action tracking",
    description: "Prioritize remediation tasks for legal, compliance, and operational teams.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Enter both email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    localStorage.setItem(
      "vcomplyLoginDraft",
      JSON.stringify({ email, rememberMe, lastAttemptAt: new Date().toISOString() })
    );

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      if (!response.user || !response.session?.access_token) {
        console.error("Incomplete login response received", response);
        setErrorMessage("Unable to sign in. Please try again.");
        return;
      }

      storeAuthState(response.session, response.user);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login request failed", error);
      setErrorMessage(getApiErrorMessage(error, "Unable to sign in."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
        <div className="space-y-8">
          <Badge tone="blue" className="px-4 py-2 text-sm normal-case tracking-[0.12em] text-sky-200">
            Compliance workspace access
          </Badge>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
              Sign in to VComply
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300">
              Access your compliance workspace to review assessments, regulatory exposure, and the
              actions your team should take next.
            </p>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Sign in with your existing workspace account to review regulatory exposure, active
              assessments, and required compliance actions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {workspaceSignals.map((signal) => (
              <Card key={signal.title} tone="subtle" className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/15 bg-sky-500/10 text-sky-300">
                  <ShieldIcon />
                </div>
                <h2 className="mt-4 text-base font-semibold text-white">{signal.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{signal.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card tone="primary" className="mx-auto w-full max-w-xl p-7 sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Workspace Sign-in
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Access your compliance workspace
            </h2>
            <p className="text-sm leading-6 text-slate-400">
              Sign in to review regulatory exposure, track remediation work, and continue current
              assessments.
            </p>
            <p className="text-sm leading-6 text-slate-500">
              Confirmed workspace accounts, including the seeded demo account, can sign in
              immediately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
                >
                  {showPassword ? "Hide" : "Show"} password
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500/20"
                />
                <span>Remember this device</span>
              </label>

              <span className="text-slate-500">Forgot password? Contact your workspace admin.</span>
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 border-t border-slate-800 pt-6 text-sm leading-6 text-slate-400">
            <p>
              New to VComply?{" "}
              <Link href="/signup" className="font-medium text-sky-300 transition hover:text-sky-200">
                Create account
              </Link>
            </p>
            <p>
              Need access?{" "}
              <a href="mailto:access@vcomply.ai" className="font-medium text-sky-300 transition hover:text-sky-200">
                Request access
              </a>{" "}
              or contact your compliance platform administrator.
            </p>
            <p>
              Prefer to start with the product overview?{" "}
              <Link href="/" className="font-medium text-slate-200 transition hover:text-white">
                Back to home
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
