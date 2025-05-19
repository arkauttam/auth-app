"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ImSpinner2 } from "react-icons/im";
import { useMutation } from "@tanstack/react-query";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import {
  loginFormSchema,
  TLoginFormSchema,
} from "@/schemas/auth/loginFormSchema";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { axiosPublic } from "@/services/axiosService";
import useAuthStore from "@/hooks/auth/useAuthStore";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: any;
  }
}

interface LoginFormProps {
  onShowSignUp: () => void;
}

const loadRecaptchaScript = (onLoad: () => void, onError: () => void) => {
  const script = document.createElement("script");
  script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  script.async = true;
  script.defer = true;
  script.onload = onLoad;
  script.onerror = onError;
  document.body.appendChild(script);

  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
};

const generateRecaptchaToken = (action: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error("CAPTCHA not loaded."));
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action })
        .then((token: string | null) => {
          if (!token) {
            reject(new Error("reCAPTCHA returned an empty token."));
          } else {
            resolve(token);
          }
        })
        .catch((err: any) => {
          console.error("reCAPTCHA error:", err);
          reject(new Error("reCAPTCHA execution failed."));
        });
    });
  });
};
;

const LoginForm = ({ onShowSignUp }: LoginFormProps) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore();

  const form = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    return loadRecaptchaScript(
      () => {
        console.log("reCAPTCHA loaded");
        setIsRecaptchaLoaded(true);
      },
      () => {
        toast.error("Failed to load reCAPTCHA. Check your network or ad blocker.");
        setIsRecaptchaLoaded(false);
      }
    );
  }, []);

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      if (!isRecaptchaLoaded) throw new Error("reCAPTCHA not loaded.");
      const recaptchaToken = await generateRecaptchaToken("send_otp");

      const response = await axiosPublic.post("/auth/send-otp/", {
        phone,
        recaptchaToken,
      });

      return response.data;
    },
    onSuccess: (data) => {
      setSessionInfo(data.sessionInfo);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    },
    onError: (error) => {
      console.error("Send OTP Error:", error);
      if (isAxiosError(error)) {
        const msg =
          error.code === "ERR_NETWORK"
            ? "Network error: Unable to reach the server."
            : error.response?.data?.message || error.response?.data.error;
        toast.error(msg);
      } else {
        toast.error((error as Error).message || "Failed to send OTP");
      }
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await axiosPublic.post("/auth/verify-otp/", {
        code,
        sessionInfo,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { access, refresh, email, full_name, phone_number } = data;
      setCookie("access", access, { maxAge: 24 * 60 * 60, sameSite: "lax" });
      setCookie("refresh", refresh, { maxAge: 24 * 60 * 60, sameSite: "lax" });
      setAccessToken(access, refresh);
      setUser({
        email,
        full_name,
        phone_number,
      })
      toast.success("Login Successful");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.message || "Invalid OTP"
          : "Failed to verify OTP"
      );
      setOtp("");
    },
  });

  const onSubmit = (values: TLoginFormSchema) => {
    if (sendOtpMutation.isPending) return;
    sendOtpMutation.mutate(values.phone ?? "");
  };

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      verifyOtpMutation.mutate(otp);
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Sign In</h2>
          <p className="mt-1 text-sm text-gray-500">
            Access your account with OTP
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    Mobile Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <PhoneInput
                    defaultCountry="in"
                    value={field.value}
                    onChange={field.onChange}
                    inputClassName="w-full h-16 px-4 py-4 border border-gray-300 rounded-2xl bg-gray-50 text-gray-800 focus:outline-none"
                    className="w-full"

                  />
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
            {otpSent ? (
              <div className="space-y-4">
                <FormLabel className="text-sm text-gray-600">
                  Enter OTP <span className="text-red-500">*</span>
                </FormLabel>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="flex gap-3"
                >
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-14 h-12 text-lg text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  ))}
                </InputOTP>

                <Button
                  type="button"
                  onClick={handleOtpSubmit}
                  disabled={verifyOtpMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  {verifyOtpMutation.isPending ? (
                    <ImSpinner2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                disabled={sendOtpMutation.isPending || !isRecaptchaLoaded}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                {sendOtpMutation.isPending ? (
                  <ImSpinner2 className="animate-spin w-5 h-5" />
                ) : (
                  "Send OTP"
                )}
              </Button>
            )}

            <div className="text-sm text-center mt-4">
              <button
                type="button"
                onClick={onShowSignUp}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create Account
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
