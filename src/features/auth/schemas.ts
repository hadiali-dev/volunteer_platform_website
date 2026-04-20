import { z } from "zod";

export const RoleSchema = z.enum(["student", "organization"]);

export const LoginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .email("البريد الإلكتروني غير صالح."),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل."),
});

export const SignupInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل."),
  email: z
    .string()
    .trim()
    .email("البريد الإلكتروني غير صالح."),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل."),
  role: z.enum(["student", "organization"]).optional(),
});

export const AuthUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  image: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AuthSuccessResponseSchema = z.object({
  status: z.literal("success"),
  token: z.string(),
  data: z.object({
    user: AuthUserSchema,
  }),
});

export const AuthErrorResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type SignupInput = z.infer<typeof SignupInputSchema>;
export type AuthUserPayload = z.infer<typeof AuthUserSchema>;
export type AuthSuccessResponse = z.infer<typeof AuthSuccessResponseSchema>;
export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;
