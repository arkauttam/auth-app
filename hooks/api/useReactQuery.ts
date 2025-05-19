import {
  useMutation,
  useQuery,
  UseQueryResult,
  MutationOptions,
} from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/api/useAxiosAuth";
import { axiosPublic } from "@/services/axiosService";
import axios from "axios";

type QueryConfig = {
  url: string;
  params?: any;
  queryKey: string;
};

type MutationConfig = {
  url: string;
  mutationKey: string;
  method?: "POST" | "PUT" | "DELETE" | "PATCH";
  params?: any;
};

const useReactQuery = () => {
  const usePublicQuery = <T>({
    url,
    params,
    queryKey,
  }: QueryConfig): UseQueryResult<T, Error> => {
    return useQuery<T, Error>({
      queryKey: [queryKey],
      queryFn: async () => {
        try {
          const response = await axiosPublic.request<T>({
            url,
            method: "GET",
            params,
          });
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.data?.error) {
              if (error.response?.data?.error.message) {
                throw new Error(error.response?.data?.error.message);
              } else throw new Error(error.response?.data?.error);
            }
            throw new Error(
              error.response?.data?.message ??
                error.response?.data?.detail ??
                error.response?.data?.errors[0]?.message ??
                error.response?.data?.errors[0]?.details ??
                error.response?.statusText,
            );
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    });
  };
  const useProtectedQuery = <T>({ url, params, queryKey }: QueryConfig) => {
    const axiosProtected = useAxiosAuth();
    return useQuery<T, Error>({
      queryKey: [queryKey],
      queryFn: async () => {
        try {
          const response = await axiosProtected.request<T>({
            url,
            method: "GET",
            params,
          });
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.data?.error) {
              if (error.response?.data?.error.message) {
                throw new Error(error.response?.data?.error.message);
              } else throw new Error(error.response?.data?.error);
            }
            throw new Error(
              error.response?.data?.message ??
                error.response?.data?.detail ??
                error.response?.data?.errors[0]?.message ??
                error.response?.data?.errors[0]?.details ??
                error.response?.statusText,
            );
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    });
  };

  const usePublicMutation = <T>({
    mutationKey,
    url,
    method = "POST",
    params,
  }: MutationConfig) => {
    const axiosProtected = useAxiosAuth();
    return useMutation<T, Error, any>({
      mutationKey: [mutationKey],
      mutationFn: async (data: any) => {
        try {
          const response = await axiosPublic.request<T>({
            url,
            method,
            data,
            ...params,
          });
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.data?.error) {
              if (error.response?.data?.error.message) {
                throw new Error(error.response?.data?.error.message);
              } else throw new Error(error.response?.data?.error);
            }
            throw new Error(
              error.response?.data?.message ??
                error.response?.data?.detail ??
                error.response?.data?.errors[0]?.message ??
                error.response?.data?.errors[0]?.details ??
                error.response?.statusText,
            );
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    });
  };
  const useProtectedMutation = <T>({
    mutationKey,
    url,
    params,
    method = "POST",
  }: MutationConfig) => {
    const axiosProtected = useAxiosAuth();
    return useMutation<T, Error, any>({
      mutationKey: [mutationKey],
      mutationFn: async (data: any) => {
        try {
          const response = await axiosProtected.request<T>({
            url,
            method,
            data,
            ...params,
          });
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.data?.error) {
              if (error.response?.data?.error.message) {
                throw new Error(error.response?.data?.error.message);
              } else throw new Error(error.response?.data?.error);
            }
            throw new Error(
              error.response?.data?.message ??
                error.response?.data?.detail ??
                error.response?.data?.errors[0]?.message ??
                error.response?.data?.errors[0]?.details ??
                error.response?.statusText,
            );
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    });
  };

  return {
    useProtectedMutation,
    usePublicMutation,
    useProtectedQuery,
    usePublicQuery,
  };
};

export default useReactQuery;
