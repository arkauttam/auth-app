import { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { axiosPublic } from "./axiosService";
import { extractTitle } from "@/lib/utils";

export type ApiOptions<T> = {
  axiosInstance?: AxiosInstance;
  url: string;
  body?: T;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  headers?: Headers;
};

export type ApiResponse<R> = {
  data: R | null;
  error: string | null;
};

export default async function customFetch<T, R>({
  axiosInstance = axiosPublic,
  url,
  body,
  method,
  headers,
}: ApiOptions<T>): Promise<ApiResponse<R>> {
  const axiosHeaders = headers
    ? Object.fromEntries(Array.from(headers.entries()))
    : undefined;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: axiosHeaders,
  };

  if (method !== "GET" && method !== "DELETE") {
    config.data = body;
  }

  try {
    const { data } = await axiosInstance(config);
    if (data?.status && data?.status >= 400) {
      return {
        data: null,
        error: "Something unexpected happened",
      };
    }
    return { data: data, error: null };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error?.response) {
        if (error.response?.status >= 500) {
          const title = extractTitle(error.response?.data);
          return {
            data: null,
            error: title || "Internal Server Error",
          };
        }

        const errorMessage =
          error.response.data?.detail ||
          error.response.data?.details ||
          error.response.data?.message ||
          error.response.data?.error?.message ||
          error?.response?.data?.error;
        return {
          data: null,
          error: errorMessage || error?.message,
        };
      }
    }
    return {
      data: null,
      error: "Something unexpected happened",
    };
  }
}
