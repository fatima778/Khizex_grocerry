import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  unit: z.enum(["kg", "lb", "pack", "each"]),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  stock: z.number().min(0),
  lowStockThreshold: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
});

export const productUpdateSchema = productSchema.partial();