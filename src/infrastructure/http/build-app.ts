import cors from "@fastify/cors";
import { fastify } from "fastify";
import { ZodError } from "zod";
import { AppError } from "@/domain/errors/app-error";
import { authPlugin } from "@/infrastructure/http/plugins/auth.plugin";
import { authRoutes } from "./routes/auth.routes";

export function buildApp() {
	const app = fastify({ logger: false });
	app.register(cors, { origin: true });
	app.register(authPlugin);

	app.setErrorHandler((err, _req, reply) => {
		if (err instanceof ZodError) {
			return reply.status(400).send({
				message: "Validation error",
				issues: err.issues,
			});
		}

		if (err instanceof AppError) {
			return reply.status(err.statusCode).send({
				message: err.message,
				code: err.code,
			});
		}

		return reply.status(500).send({ message: "Internal Server Error" });
	});
	app.register(authRoutes, { prefix: "/auth" });
	return app;
}
