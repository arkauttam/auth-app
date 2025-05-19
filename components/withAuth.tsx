"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const refreshToken = getCookie("refresh");

      if (!refreshToken) {
        router.push("/");
      }
    });

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
