import { z } from "zod";

export const signupFormSchema = z
  .object({
    firstname: z.string().min(2, "This field is required"),
    lastname: z.string().min(2, "This field is required"),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z.string().min(2, "This field is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type TSignupFormSchema = z.infer<typeof signupFormSchema>;

