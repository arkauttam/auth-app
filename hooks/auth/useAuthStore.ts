"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCookie, setCookie } from "cookies-next";

export type TAuthModal = {
  open: boolean;
};

interface User {
  email: string;
  full_name: string;
  phone_number: string;
}

interface State {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  openAuthModal: boolean;
  user: User | null;
}

interface Actions {
  setAccessToken: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setUserLoggedOut: () => void;
  setIsLoading: (isLoading: boolean) => void;
  initializeAuth: () => void;
}

const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      openAuthModal: false,
      isAuthenticated: false,
      user: null,

      setIsLoading(isLoading) {
        set({ isLoading });
      },

      setAccessToken(accessToken, refreshToken) {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        // Set cookies
        setCookie("access", accessToken, {
          maxAge: 24 * 60 * 60,
          sameSite: "lax",
        });
        setCookie("refresh", refreshToken, {
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "lax",
        });
      },

      setUser(user) {
        set({ user });
      },

      setUserLoggedOut() {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        setCookie("access", "", { maxAge: -1 });
        setCookie("refresh", "", { maxAge: -1 });
      },

      initializeAuth() {
        const accessToken = getCookie("access");
        const refreshToken = getCookie("refresh");

        if (accessToken && refreshToken) {
          set({
            accessToken: accessToken as string,
            refreshToken: refreshToken as string,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (key) => getCookie(key) as string,
        setItem: (key, value) =>
          setCookie(key, value, { maxAge: 24 * 60 * 60, sameSite: "lax" }),
        removeItem: (key) =>
          setCookie(key, "", { maxAge: -1 }),
      })),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
