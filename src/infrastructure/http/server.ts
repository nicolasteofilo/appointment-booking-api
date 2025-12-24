import { env } from "@/infrastructure/env";
import { app } from "@/infrastructure/http/app";

const PORT = env.PORT;

async function startServer() {
	try {
		await app.listen({ port: PORT, host: "0.0.0.0" });

		console.log(`🔥 Server is running on port ${PORT}`);
		console.log(`📖 API documentation available at ${""}/docs`);
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
}

startServer();
