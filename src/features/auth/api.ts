import { api } from "@/lib/api";

import {
  AuthSuccessResponseSchema,
  LoginInputSchema,
  SignupInputSchema,
  type AuthSuccessResponse,
  type LoginInput,
  type SignupInput,
} from "@/features/auth/schemas";

export const loginUser = async (
  credentials: LoginInput,
): Promise<AuthSuccessResponse> => {
  const payload = LoginInputSchema.parse(credentials);
  const response = await api.post("/api/auth/login", payload);
  return AuthSuccessResponseSchema.parse(response.data);
};

export const signupUser = async (
  input: SignupInput,
): Promise<AuthSuccessResponse> => {
  const payload = SignupInputSchema.parse(input);
  const response = await api.post("/api/auth/signup", payload);
  return AuthSuccessResponseSchema.parse(response.data);
};
