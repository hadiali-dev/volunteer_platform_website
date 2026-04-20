"use server";

import { actionClient } from "@/lib/safe-action";

import { loginUser, signupUser } from "@/features/auth/api";
import { LoginInputSchema, SignupInputSchema } from "@/features/auth/schemas";

export const loginAction = actionClient
  .inputSchema(LoginInputSchema)
  .action(async ({ parsedInput }) => {
    return loginUser(parsedInput);
  });

export const signupAction = actionClient
  .inputSchema(SignupInputSchema)
  .action(async ({ parsedInput }) => {
    return signupUser(parsedInput);
  });
