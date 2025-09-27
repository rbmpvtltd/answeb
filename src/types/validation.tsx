import { z } from "zod";

export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
  }).optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;