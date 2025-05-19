"use client";
import { setCookie, getCookie } from "cookies-next";
import { axiosPublic } from "@/services/axiosService";
import useAuthStore from "../auth/useAuthStore";

export const useRefreshToken = () => {
  const { setAccessToken, setUserLoggedOut } = useAuthStore();

  const refreshToken = async () => {
    try {
      const token = getCookie("refresh");
      if (!token) {
        setUserLoggedOut();
        throw new Error("No refresh token available");
      }

      const { data } = await axiosPublic({
        url: "/auth/token/refresh/",
        method: "POST",
        data: {
          refresh: token,
        },
      });

     const newRefreshToken = data.refresh || token;

      setAccessToken(data.access, newRefreshToken || {});
      setCookie("access", data.access, {
        maxAge: 24 * 60 * 60, 
        sameSite: "lax",
      });
      setCookie("refresh", newRefreshToken, {
        maxAge: 24 * 60 * 60, 
        sameSite: "lax",
      });

      return data.access;
    } catch (error) {
      console.error("Refresh token error:", error);
      setUserLoggedOut();
      throw error;
    }
  };

  return refreshToken;
};