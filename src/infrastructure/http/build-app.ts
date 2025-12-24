import cors from "@fastify/cors";
import { fastify } from "fastify";
import { ZodError } from "zod";

import { AppError } from "@/domain/errors/app-error";

export function buildApp() {
	const app = fastify({ logger: false });

	app.register(cors, { origin: true });

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

	return app;
}
