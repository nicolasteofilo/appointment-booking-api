import cors from "@fastify/cors";
import { fastify } from "fastify";
import { ZodError } from "zod";
import { AppError } from "@/domain/errors/app-error";
import { authRoutes } from "./routes/auth.routes";

const app = fastify({ logger: true });
app.register(cors, { origin: true });

// ERROR HANDLER
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

	app.log.error(err);
	return reply.status(500).send({ message: "Internal Server Error" });
});

// ROUTES
app.register(authRoutes, { prefix: "/auth" });

export { app };
