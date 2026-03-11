import axios from "axios";
import { env } from "@/lib/env";
import { getAccessToken } from "@/lib/auth/token";

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30_000
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
