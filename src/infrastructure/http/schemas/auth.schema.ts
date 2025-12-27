import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(2).max(120),
	email: z.email(),
	password: z.string().min(8).max(72),
});

export const registerResponseSchema = z.object({
	userId: z.string(),
});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(72),
});

export const loginResponseSchema = z.object({
	accessToken: z.string(),
});

export const meSchema = z.object({
	userId: z.string(),
});

export const meResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	role: z.enum(["admin", "user", "guest"]),
	timezone: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type RegisterBody = z.infer<typeof registerSchema>;
