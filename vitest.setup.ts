import path from "node:path";
import { config } from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { Pool } from "pg";
import { afterAll, beforeAll, beforeEach } from "vitest";

config({ path: ".env.test", override: true });

let pool: Pool;
let db: any;

// Run migrations and setup/teardown hooks for tests
beforeAll(async () => {
	const mod = await import("./src/infrastructure/database/drizzle/db.js");
	db = mod.db;
	pool = mod.pool;
	await migrate(db, {
		migrationsFolder: path.resolve(
			process.cwd(),
			"src/infrastructure/database/migrations",
		),
	});
});

beforeEach(async () => {
	// clear state between tests (adapt if you have more tables later)
	await pool.query('TRUNCATE TABLE "users" CASCADE;');
});

afterAll(async () => {
	await pool.end();
});
