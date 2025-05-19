"use client";
import React, { useState, useEffect } from "react";
import LoginForm from "@/components/forms/LoginForm";
import SignUpForm from "@/components/forms/SignupForm";
import useAuthStore from "@/hooks/auth/useAuthStore";

const Page = () => {
  const { isAuthenticated } = useAuthStore();
  const [currentForm, setCurrentForm] = useState<"login" | "signup">("login");

  const handleShowSignUp = () => setCurrentForm("signup");
  const handleShowLogin = () => setCurrentForm("login");

  useEffect(() => {
    console.log("isAuthenticated changed:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div>
      {currentForm === "login" && (
        <LoginForm onShowSignUp={handleShowSignUp} />
      )}
      {currentForm === "signup" && (
        <SignUpForm onShowLogin={handleShowLogin} />
      )}
    </div>
  );
};

export default Page;
