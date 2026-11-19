"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { signupUser } from "@/features/auth/api";
import {
  SignupInputSchema,
  type LoginInput,
  type SignupInput,
} from "@/features/auth/schemas";
import { AppError } from "@/types";

interface CredentialsSignInResult {
  ok: boolean;
  status: number;
  url: string | null;
}

const getLoginErrorMessage = (errorCode: string): string => {
  if (errorCode === "CredentialsSignin" || errorCode === "invalid_credentials") {
    return "بيانات تسجيل الدخول غير صحيحة.";
  }

  if (errorCode === "RATE_LIMIT" || errorCode.includes("rate_limit")) {
    return "محاولات كثيرة جداً. يرجى المحاولة لاحقاً.";
  }

  if (errorCode === "Configuration") {
    return "يوجد خطأ في إعدادات تسجيل الدخول. تحقق من NEXTAUTH_URL و NEXTAUTH_SECRET ثم أعد تشغيل التطبيق.";
  }

  return "تعذر تسجيل الدخول. حاول مرة أخرى.";
};

const loginWithCredentials = async (
  email: string,
  password: string,
): Promise<CredentialsSignInResult> => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (!result) {
    throw new AppError("تعذر تسجيل الدخول. حاول مرة أخرى.", 500);
  }

  if (result.error) {
    console.error("Login error code:", result.error);
    const statusCode =
      result.error === "Configuration" ? 500 : result.error.includes("rate") ? 429 : 401;
    throw new AppError(getLoginErrorMessage(result.error), statusCode);
  }

  return {
    ok: result.ok,
    status: result.status,
    url: result.url,
  };
};

export const useLogin = (): UseMutationResult<
  CredentialsSignInResult,
  Error,
  LoginInput
> => {
  return useMutation({
    mutationFn: async (credentials) => {
      return loginWithCredentials(credentials.email, credentials.password);
    },
  });
};

export const useSignup = (): UseMutationResult<
  CredentialsSignInResult,
  Error,
  SignupInput
> => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload) => {
      const parsedPayload = SignupInputSchema.parse(payload);
      const signupResponse = await signupUser(parsedPayload);

      if (!signupResponse.token) {
        throw new AppError("حدث خطأ أثناء إنشاء الحساب.", 500);
      }

      // Manual login by calling the provider with the token we already have.
      // This bypasses the authorize() backend request entirely for auto-login.
      const result = await signIn("credentials", {
        email: parsedPayload.email,
        password: parsedPayload.password,
        autoLoginToken: signupResponse.token,
        autoLoginUser: JSON.stringify(signupResponse.data.user),
        redirect: false,
      });

      if (!result) {
        throw new AppError("تعذر تسجيل الدخول التلقائي. يرجى تسجيل الدخول يدوياً.", 500);
      }

      if (result.error) {
        console.error("Auto-login error:", result.error);
        // If auto-login fails, we don't throw, we just redirect to login
        // since the account IS created (201).
        router.push("/login");
        return {
          ok: false,
          status: 401,
          url: "/login",
        };
      }

      return {
        ok: result.ok,
        status: result.status,
        url: result.url,
      };
    },
  });
};
