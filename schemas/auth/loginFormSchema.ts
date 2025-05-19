import { z } from "zod";
export const loginFormSchema = z.object({
  phone: z
    .string().min(10, "Enter a valid phone number"),
});

export type TLoginFormSchema = z.infer<typeof loginFormSchema>;