import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  constituency: z.string().optional(),
  voterId: z.string().optional(),
  isRegistered: z.boolean().optional(),
  interests: z.array(z.string()).optional(),
  language: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

export const fakeNewsSchema = z.object({
  content: z.string().min(10, "Please enter at least 10 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type FakeNewsInput = z.infer<typeof fakeNewsSchema>;
