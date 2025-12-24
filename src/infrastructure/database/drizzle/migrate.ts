import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./db";

async function main() {
	await migrate(db, {
		migrationsFolder: "./src/infrastructure/database/drizzle/migrations",
	});
	await pool.end();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
