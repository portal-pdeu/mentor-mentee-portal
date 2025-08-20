"use client";

import { configureStore } from "@reduxjs/toolkit";
import authSlice, {
  authState,
  initialState as initialAuthState,
} from "./authSlice";
import settingsSlice, {
  settingsState,
  initialState as initialSettingsState,
} from "./settingsSlice";
import CryptoJS from "crypto-js";

const STORAGE_KEY = "Data";
const SECRET_KEY = String(process.env.NEXT_PUBLIC_SECRET_KEY);

interface RootState {
  auth: authState;
  settings: settingsState;
}

const initialState = {
  auth: initialAuthState,
  settings: initialSettingsState,
};

const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const loadData = (): RootState => {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const encryptedState = localStorage.getItem(STORAGE_KEY);
    if (!encryptedState) {
      return initialState;
    }
    return decryptData(encryptedState);
  } catch (err) {
    console.error("Error loading state:", err);
    return initialState;
  }
};

const saveData = (state: RootState): void => {
  if (typeof window === "undefined") return;

  try {
    const encryptedState = encryptData(state);
    localStorage.setItem(STORAGE_KEY, encryptedState);
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

const preloadedState = loadData();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    settings: settingsSlice,
  },
  preloadedState,
});

store.subscribe(() => {
  saveData(store.getState());
});

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;