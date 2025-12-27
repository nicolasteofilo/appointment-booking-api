import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { AppError } from "@/domain/errors/app-error";
import { authServiceFactory } from "@/infrastructure/factories/auth/auth-service.factory";

export const authPlugin: FastifyPluginAsync = fp(async (app) => {
	app.decorateRequest("auth", null);

	app.decorate("authenticate", async (req: FastifyRequest) => {
		const header = req.headers.authorization;
		if (!header?.startsWith("Bearer ")) {
			throw new AppError("Missing token", 401, "MISSING_TOKEN");
		}

		const token = header.slice("Bearer ".length);

		const authService = authServiceFactory();
		req.auth = await authService.authenticate(token);
	});

	app.decorate("optionalAuth", async (req: FastifyRequest) => {
		const header = req.headers.authorization;
		if (!header?.startsWith("Bearer ")) return;

		const token = header.slice("Bearer ".length);

		const authService = authServiceFactory();
		req.auth = await authService.authenticate(token);
	});
});
