import { AxiosError } from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { loginUser } from "@/features/auth/api";
import {
  AuthErrorResponseSchema,
  LoginInputSchema,
  RoleSchema,
} from "@/features/auth/schemas";
import { env } from "@/lib/env";

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const decodeJwtExpiry = (token: string): number | undefined => {
  const payloadPart = token.split(".")[1];
  if (!payloadPart) {
    return undefined;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadPart, "base64url").toString("utf8"),
    ) as { exp?: number };

    if (typeof payload.exp !== "number") {
      return undefined;
    }

    return payload.exp * 1000;
  } catch {
    return undefined;
  }
};

const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const parsed = AuthErrorResponseSchema.safeParse(error.response?.data);
    if (parsed.success) {
      return parsed.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "تعذر تسجيل الدخول. حاول مرة أخرى.";
};

class InvalidCredentialsError extends CredentialsSignin {
  public code = "invalid_credentials";
}

const authSecret = env.NEXTAUTH_SECRET;
if (!authSecret) {
  throw new Error("NEXTAUTH_SECRET is required for authentication.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "تسجيل الدخول",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = LoginInputSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new InvalidCredentialsError();
        }

        try {
          const result = await loginUser(parsed.data);
          return {
            id: result.data.user._id,
            name: result.data.user.name,
            email: result.data.user.email,
            role: result.data.user.role,
            image: result.data.user.image,
            active: result.data.user.active,
            accessToken: result.token,
          };
        } catch (error) {
          if (error instanceof AxiosError) {
            const statusCode = error.response?.status;
            if (statusCode === 400 || statusCode === 401) {
              throw new InvalidCredentialsError();
            }
          }

          console.error("Auth authorize error:", getAuthErrorMessage(error));
          throw new CredentialsSignin();
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image ?? null;
        token.active = user.active;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt =
          typeof user.accessToken === "string"
            ? decodeJwtExpiry(user.accessToken)
            : undefined;
      }

      if (
        typeof token.accessTokenExpiresAt === "number" &&
        Date.now() >= token.accessTokenExpiresAt
      ) {
        token.accessToken = "";
        token.accessTokenExpiresAt = undefined;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.name = typeof token.name === "string" ? token.name : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.image = typeof token.image === "string" ? token.image : null;
        session.user.active = token.active === true;

        const parsedRole = RoleSchema.safeParse(token.role);
        session.user.role = parsedRole.success ? parsedRole.data : "student";
      }

      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : "";
      return session;
    },
  },
});
