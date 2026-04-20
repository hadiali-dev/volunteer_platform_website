import type { DefaultSession } from "next-auth";

export type Role = "student" | "organization" | "admin";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AuthSessionUser = DefaultSession["user"] & {
  id: string;
  role: Role;
  active: boolean;
  image: string | null;
};

declare module "next-auth" {
  interface Session {
    user: AuthSessionUser;
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    image?: string | null;
    active: boolean;
    accessToken: string;
  }
}
