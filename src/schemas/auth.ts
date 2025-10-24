import { z } from "zod";

export const registerSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Required")
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
      "Invalid email or phone"
    ),
  username: z.string().min(3, "Username must be at least 3 chars"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  identifier: z.string()
    .min(1, "Required")
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),  //|| /^[a-zA-Z0-9_]{3,20}$/.test(val),
      "Enter valid phone number or email"
    ),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password too long"),
})

export type LoginInput = z.infer<typeof loginSchema>;

// forgotSchema
// const forgotSchema = z.object({
//   emailOrPhone: z
//     .string()
//     .min(1, "Required")
//     .refine(
//       (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
//       "Invalid email or phone"
//     ),
//   otp: z.string().length(6, "OTP must be 6 digits"),
//   newPassword: z.string().min(6, "Password must be at least 6 chars"),
// });

// export type forgetInput = z.infer<typeof forgotSchema>;