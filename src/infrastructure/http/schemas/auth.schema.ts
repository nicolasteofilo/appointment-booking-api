import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(2).max(120),
	email: z.email(),
	password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(72),
});

export const meSchema = z.object({
	userId: z.string(),
});

export type RegisterBody = z.infer<typeof registerSchema>;
