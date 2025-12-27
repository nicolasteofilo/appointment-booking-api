import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing for production");

// guard rail forte: exige “chave” explícita
if (process.env.MIGRATE_PROD !== "true") {
	throw new Error(
		"Refusing to run PROD migrations. Set MIGRATE_PROD=true to confirm.",
	);
}

export default defineConfig({
	dialect: "postgresql",
	out: "./src/infrastructure/database/migrations",
	schema: "./src/infrastructure/database/drizzle/schema/index.ts",
	dbCredentials: { url },
});
