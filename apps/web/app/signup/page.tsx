"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { isAuthenticated, storeAuthState } from "@/lib/auth";
import { getApiErrorMessage, signup } from "@/lib/api";

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V20" />
      <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M10 20v-3.5a1.5 1.5 0 0 1 3 0V20" />
    </svg>
  );
}

const onboardingSignals = [
  {
    title: "Company-only access",
    description: "Use your work email so the workspace can be tied to a real operating entity.",
  },
  {
    title: "Assessment continuity",
    description: "Return to prior assessments, impacted regulations, and tracked remediation work.",
  },
  {
    title: "Shared operating view",
    description: "Give legal, compliance, and product teams one place to review AI obligations.",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Complete all required fields to create an account.");
      setSuccessMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await signup({
        email: email.trim(),
        password,
      });

      if (response.session) {
        storeAuthState(response.session, response.user);
        router.replace("/dashboard");
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccessMessage(
        response.message ||
          (response.confirmation_required
            ? "Account created. Confirm your email address before signing in."
            : "Account created. You can sign in now.")
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to create account."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
        <div className="motion-enter space-y-8">
          <Badge tone="blue" className="px-4 py-2 text-sm normal-case tracking-[0.12em] text-sky-200">
            Company workspace provisioning
          </Badge>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
              Create your VComply account
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300">
              Set up access to the compliance workspace for assessments, regulatory exposure, and
              required action tracking.
            </p>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Use your company email address to create an account. You will need to confirm that
              email before first sign-in. Personal email domains are not accepted for workspace
              access.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {onboardingSignals.map((signal) => (
              <Card key={signal.title} tone="subtle" className="motion-lift p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/15 bg-sky-500/10 text-sky-300">
                  <BuildingIcon />
                </div>
                <h2 className="mt-4 text-base font-semibold text-white">{signal.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{signal.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card
          tone="primary"
          className="motion-enter motion-enter-delay-2 mx-auto w-full max-w-xl p-7 sm:p-8"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Create Account
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Provision your compliance workspace
            </h2>
            <p className="text-sm leading-6 text-slate-400">
              Use a work email to create access for your company team. Newly created non-demo
              accounts must confirm the email address before they can sign in.
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
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
                >
                  {showConfirmPassword ? "Hide" : "Show"} password
                </button>
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </div>

            {errorMessage ? (
              <div className="motion-message rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="motion-message rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {successMessage}
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 border-t border-slate-800 pt-6 text-sm leading-6 text-slate-400">
            <p>
              Already have access?{" "}
              <Link href="/login" className="font-medium text-sky-300 transition hover:text-sky-200">
                Sign in
              </Link>
            </p>
            <p>
              Need approval first?{" "}
              <a href="mailto:access@vcomply.ai" className="font-medium text-sky-300 transition hover:text-sky-200">
                Contact your workspace administrator
              </a>
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
