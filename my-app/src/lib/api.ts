import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { AuthErrorResponseSchema } from "@/features/auth/schemas";
import { env } from "@/lib/env";
import { AppError } from "@/types";

const LOGIN_PATH = "/login";
const AUTH_ENDPOINTS = ["/api/auth/login", "/api/auth/signup"];

const shouldSkipTokenInjection = (url: string | undefined): boolean =>
  AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint));

const parseErrorMessage = (error: AxiosError<unknown>): string => {
  const parsed = AuthErrorResponseSchema.safeParse(error.response?.data);
  if (parsed.success) {
    return parsed.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "حدث خطأ غير متوقع.";
};

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    if (shouldSkipTokenInjection(config.url)) {
      return config;
    }

    let accessToken: string | undefined;

    if (typeof window === "undefined") {
      const { auth } = await import("@/lib/auth");
      const session = await auth();
      accessToken = session?.accessToken;
    } else {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      accessToken = session?.accessToken;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<unknown>) => {
    const statusCode = error.response?.status;
    const message = parseErrorMessage(error);

    if (statusCode === 401) {
      if (typeof window !== "undefined") {
        const { signOut } = await import("next-auth/react");
        await signOut({ redirect: false });
        window.location.href = LOGIN_PATH;
      }

      return Promise.reject(new AppError(message, 401));
    }

    if (statusCode !== undefined && statusCode >= 500) {
      return Promise.reject(new AppError(message, statusCode));
    }

    if (statusCode !== undefined) {
      return Promise.reject(new AppError(message, statusCode));
    }

    return Promise.reject(
      new AppError("تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.", 500),
    );
  },
);

export { api };
