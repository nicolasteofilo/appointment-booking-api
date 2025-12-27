import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().min(1).max(65535).default(3000),
	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	throw new Error("Invalid environment variables.");
}

export const env = _env.data;
