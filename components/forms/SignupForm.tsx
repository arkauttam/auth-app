"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { axiosPublic } from "@/services/axiosService";
import { toast } from "sonner";
import {
  signupFormSchema,
  TSignupFormSchema,
} from "@/schemas/auth/signupFormSchema";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useMutation } from "@tanstack/react-query";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface SignUpFormProps {
  onShowLogin: () => void;
}

const SignUpForm = ({ onShowLogin }: SignUpFormProps) => {
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [isConfirmPasswordShowing, setIsConfirmPasswordShowing] = useState(false);

  const form = useForm<TSignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (values: TSignupFormSchema) => {
      const payload = {
        full_name: `${values.firstname} ${values.lastname}`,
        email: values.email,
        phone_number: values.phoneNumber,
        password: values.password,
        confirm_password: values.confirmPassword,
      };

      const response = await axiosPublic.post("/auth/register/", payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Account created for ${variables.email}`);
      onShowLogin();
      form.reset();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Signup failed"
      );
    },
  });

  const handleSubmit = (values: TSignupFormSchema) => {
    signupMutation.mutate(values);
  };

  const isLoading = signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 space-y-8 transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join us today</p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      First Name<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="first name"
                        autoComplete="given-name"
                        className="h-12 border-gray-200 bg-gray-50 rounded-xl focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Last Name<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="last name"
                        autoComplete="family-name"
                        className="h-12 border-gray-200 bg-gray-50 rounded-xl focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Email<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email address"
                        autoComplete="email"
                        className="h-12 border-gray-200 bg-gray-50 rounded-xl focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Phone Number<span className="text-red-500 ml-1">*</span>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Password<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordShowing ? "text" : "password"}
                          placeholder="Enter password"
                          autoComplete="new-password"
                          className="h-12 border-gray-200 bg-gray-50 rounded-xl focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsPasswordShowing((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <span className="text-lg text-indigo-600 hover:text-purple-700 transition-colors duration-200">
                            {isPasswordShowing ? (
                              <VscEyeClosed className="h-6 w-6" />
                            ) : (
                              <VscEye className="h-6 w-6" />
                            )}
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Confirm Password<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isConfirmPasswordShowing ? "text" : "password"}
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          className="h-12 border-gray-200 bg-gray-50 rounded-xl focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsConfirmPasswordShowing((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <span className="text-lg text-indigo-600 hover:text-purple-700 transition-colors duration-200">
                            {isConfirmPasswordShowing ? (
                              <VscEyeClosed className="h-6 w-6" />
                            ) : (
                              <VscEye className="h-6 w-6" />
                            )}
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <ImSpinner2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>Create Account</span>
              )}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={onShowLogin}
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                Already have an account?
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;