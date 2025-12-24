import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/infrastructure/database/migrations",
	schema: "./src/infrastructure/database/drizzle/schema/index.ts",
	breakpoints: false,
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
});
