/**
 * api.ts — Base API utility
 */

import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;

  const authHeaders: Record<string, string> = skipAuth ? {} : {
    Authorization: `Bearer ${getToken() ?? ""}`,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "API Error");
  }

  return data as T;
}

export const api = {
  get:    <T = unknown>(path: string, opts?: RequestOptions) =>
            request<T>(path, { method: "GET", ...opts }),

  post:   <T = unknown>(path: string, body: object, opts?: RequestOptions) =>
            request<T>(path, { method: "POST", body: JSON.stringify(body), ...opts }),

  put:    <T = unknown>(path: string, body: object, opts?: RequestOptions) =>
            request<T>(path, { method: "PUT", body: JSON.stringify(body), ...opts }),

  delete: <T = unknown>(path: string, opts?: RequestOptions) =>
            request<T>(path, { method: "DELETE", ...opts }),

  upload: async <T = unknown>(path: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken() ?? ""}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Upload Error");
    return data as T;
  },
};

export default api;
