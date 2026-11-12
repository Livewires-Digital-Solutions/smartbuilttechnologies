"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/(admin)/sys-ops/actions";
import { SubmitButton } from "./ui";
import { inputCls } from "./styles";

/** The one shared admin login. */
export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form
      action={action}
      className="flex flex-col gap-5"
      aria-label="Admin sign in"
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-overline font-medium text-slate-700 uppercase">
          Username
        </span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className={inputCls}
          aria-invalid={!!state.error}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-overline font-medium text-slate-700 uppercase">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCls}
          aria-invalid={!!state.error}
        />
      </label>
      <p
        role="alert"
        aria-live="polite"
        className="min-h-5 text-[0.9375rem] text-orange"
      >
        {state.error}
      </p>
      <div>
        <SubmitButton pending="Signing in…">Sign in</SubmitButton>
      </div>
    </form>
  );
}
