"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

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
  if (errorCode === "CredentialsSignin") {
    return "بيانات تسجيل الدخول غير صحيحة.";
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
    const statusCode = result.error === "Configuration" ? 500 : 401;
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
  return useMutation({
    mutationFn: async (payload) => {
      const parsedPayload = SignupInputSchema.parse(payload);
      await signupUser(parsedPayload);

      return loginWithCredentials(parsedPayload.email, parsedPayload.password);
    },
  });
};
