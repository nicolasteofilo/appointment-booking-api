import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env", override: true });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is missing for dev");
}

export default defineConfig({
	dialect: "postgresql",
	out: "./src/infrastructure/database/migrations",
	schema: "./src/infrastructure/database/drizzle/schema/index.ts",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
