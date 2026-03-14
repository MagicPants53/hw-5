"use client";
import { User } from "../types/user";

export const USER_DATA_KEY = "user_data";
const AUTH_TOKEN_COOKIE = "auth_token";

export const setAuthData = (user: User) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? (JSON.parse(userData) as User) : null;
};

export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_DATA_KEY);
};

export const setAuthToken = (token: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; path=/; max-age=2592000; samesite=lax`;
};

export const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const match = cookies.find((row) => row.startsWith(`${AUTH_TOKEN_COOKIE}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1]);
};

export const clearAuthToken = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
};
