import { env } from "@/infrastructure/env";
import { app } from "@/infrastructure/http/app";

const PORT = env.PORT;

async function startServer() {
	try {
		await app.listen({ port: PORT, host: "0.0.0.0" });

		console.log(`🔥 Server is running on port ${PORT}`);
		console.log(`📖 API documentation available at ${PORT}/docs`);
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
}

const shutdown = async (signal: string) => {
	try {
		await app.close();
	} finally {
		console.log(`🛑 Server stopped (${signal})`);
		process.exit(0);
	}
};

process.on("SIGINT", () => {
	void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
	void shutdown("SIGTERM");
});

startServer();
