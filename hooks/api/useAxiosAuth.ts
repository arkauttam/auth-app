"use client";

import { useEffect } from "react";
import { axiosProtected } from "@/services/axiosService";
import { useRefreshToken } from "./useRefreshToken";
import useAuthStore from "../auth/useAuthStore";
import { useRouter } from "next/navigation";

let isRefreshing = false;
let pendingRequests: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  pendingRequests.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  pendingRequests = [];
};

export const useAxiosAuth = () => {
  const refreshToken = useRefreshToken();
  const { accessToken, isLoading, setUserLoggedOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const requestIntercept = axiosProtected.interceptors.request.use(
      (config) => {
        if (!isLoading && accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosProtected.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;

        if (error.response?.status === 401 && !prevRequest._retry) {
          if (isRefreshing) {
            try {
              const token = await new Promise<string>((resolve, reject) => {
                pendingRequests.push({ resolve, reject });
              });
              prevRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosProtected(prevRequest);
            } catch (err) {
              return Promise.reject(err);
            }
          }

          prevRequest._retry = true;
          isRefreshing = true;

          try {
            const newAccess = await refreshToken();
            processQueue(null, newAccess);
            prevRequest.headers["Authorization"] = `Bearer ${newAccess}`;
            return axiosProtected(prevRequest);
          } catch (err) {
            console.error("Token refresh error:", err);
            processQueue(err, null);
            setUserLoggedOut();
            router.push("/");
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosProtected.interceptors.request.eject(requestIntercept);
      axiosProtected.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, isLoading, refreshToken, setUserLoggedOut, router]);

  return axiosProtected;
};