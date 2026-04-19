import { ProfileName, ProfilesData } from "@/types";
import { initialProfilesData } from "./utils";

const STORAGE_KEY = "ranking-bebidas-data";
const PROFILE_KEY = "ranking-bebidas-selected-profile";
const AUTH_KEY = "ranking-bebidas-auth";

export function saveProfilesData(data: ProfilesData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProfilesData(): ProfilesData {
  if (typeof window === "undefined") return initialProfilesData();

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return initialProfilesData();

  try {
    return JSON.parse(saved) as ProfilesData;
  } catch {
    return initialProfilesData();
  }
}

export function saveSelectedProfile(profile: ProfileName) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, profile);
}

export function loadSelectedProfile(): ProfileName | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PROFILE_KEY) as ProfileName | null;
}

export function saveProfileAuth(profile: ProfileName) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, profile);
}

export function loadProfileAuth(): ProfileName | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEY) as ProfileName | null;
}

export function clearProfileAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(AUTH_KEY);
}