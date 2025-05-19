"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type FC } from "react";

interface Props {
  children: React.ReactNode;
}

const QueryProvider: FC<Props> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
