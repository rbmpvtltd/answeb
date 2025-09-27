import { z } from "zod";

// email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// phone regex (India example, +91 optional)
const phoneRegex = /^(\+91)?[6-9]\d{9}$/;

export const sendOtpSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email, phone or username is required")
    .refine((val) => {
      // agar email match ho gaya
      if (emailRegex.test(val)) return true;
      // agar phone match ho gaya
      if (phoneRegex.test(val)) return true;
    }, "Enter a valid email, phone, or username"),
});


// // Signup validation
// export const signupSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// // Login validation
// export const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// // Optional: infer TypeScript types from schemas
// export type SendOtpDto = z.infer<typeof sendOtpSchema>;
// export type SignupDto = z.infer<typeof signupSchema>;
// export type LoginDto = z.infer<typeof loginSchema>;

