import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.test", override: true });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing for test");

// guard rail simples (evita rodar em prod por acidente)
if (!url.includes("test")) {
	throw new Error(
		"Refusing to run TEST migrations because DATABASE_URL does not look like a test database",
	);
}

export default defineConfig({
	dialect: "postgresql",
	out: "./src/infrastructure/database/migrations",
	schema: "./src/infrastructure/database/drizzle/schema/index.ts",
	dbCredentials: { url },
});
