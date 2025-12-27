import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { AppError } from "@/domain/errors/app-error";
import { authPlugin } from "@/infrastructure/http/plugins/auth.plugin";
import { authRoutes } from "./routes/auth.routes";

type BuildAppOptions = {
	logger?: boolean;
};

export function buildApp(options: BuildAppOptions = {}) {
	const app = fastify({ logger: options.logger ?? true });

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	app.register(cors, {
		origin: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		// credentials: true,
	});
	app.register(authPlugin);
	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Appointment Booking API",
				description:
					"API for scheduling appointments in a simple and fast way.",
				version: "1.0.0",
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
		transform: jsonSchemaTransform,
	});

	app.register(ScalarApiReference, {
		routePrefix: "/docs",
	});

	app.setErrorHandler((err, _req, reply) => {
		if (hasZodFastifySchemaValidationErrors(err)) {
			return reply.status(400).send({
				message: "Validation error",
				issues: err.validation,
			});
		}

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

	// ROUTES
	app.register(authRoutes, { prefix: "/auth" });

	return app;
}
