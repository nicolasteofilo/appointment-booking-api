import { env } from "@/infrastructure/env";
import { app } from "@/infrastructure/http/app";

const PORT = env.PORT;

async function startServer() {
	try {
		app.listen(
			{
				port: PORT,
			},
			() => {
				console.log(`🔥 Server is running on port ${PORT}`);
				console.log(`📖 API documentation available at ${""}/docs`);
			},
		);
	} catch (error) {
		console.log(error);
	}
}

startServer();
