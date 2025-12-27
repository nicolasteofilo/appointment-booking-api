import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { GetMeUseCase } from "@/application/use-cases/auth/get-me/get-me.usecase";
import type { LoginUserUseCase } from "@/application/use-cases/auth/login-user/login-user.usecase";
import type { RegisterUserUseCase } from "@/application/use-cases/auth/register-user/register-user.usecase";
import { getMeFactory } from "@/infrastructure/factories/auth/get-me.factory";
import { loginUserFactory } from "@/infrastructure/factories/auth/login-user.factory";
import { registerUserFactory } from "@/infrastructure/factories/auth/register-user.factory";
import { requireRole } from "../guards/require-role.guard";
import {
	loginResponseSchema,
	loginSchema,
	meResponseSchema,
	meSchema,
	registerResponseSchema,
	registerSchema,
} from "../schemas/auth.schema";

type AuthRoutesDeps = {
	registerUserUseCase?: RegisterUserUseCase;
	loginUserUseCase?: LoginUserUseCase;
	getMeUseCase?: GetMeUseCase;
};

export async function authRoutes(
	app: FastifyInstance,
	deps: AuthRoutesDeps = {},
) {
	const registerUserUseCase = deps.registerUserUseCase ?? registerUserFactory();
	const loginUserUseCase = deps.loginUserUseCase ?? loginUserFactory();
	const getMeUseCase = deps.getMeUseCase ?? getMeFactory();

	const appWithTypes = app.withTypeProvider<ZodTypeProvider>();

	appWithTypes.route({
		method: "POST",
		url: "/register",
		schema: {
			tags: ["Auth"],
			summary: "Register a new user",
			body: registerSchema,
			response: {
				201: registerResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const out = await registerUserUseCase.execute(req.body);
			return reply.code(201).send(out);
		},
	});

	appWithTypes.route({
		method: "POST",
		url: "/login",
		schema: {
			tags: ["Auth"],
			summary: "Authenticate a user",
			body: loginSchema,
			response: {
				200: loginResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const out = await loginUserUseCase.execute(req.body);
			return reply.code(200).send(out);
		},
	});

	appWithTypes.route({
		method: "GET",
		url: "/me",
		schema: {
			tags: ["Auth"],
			summary: "Get current user",
			security: [{ bearerAuth: [] }],
			response: {
				200: meResponseSchema,
			},
		},
		preHandler: [app.authenticate, requireRole(["admin", "user"])],
		handler: async (req, reply) => {
			const content = meSchema.parse(req.auth);
			const out = await getMeUseCase.execute(content);
			return reply.code(200).send({
				...out,
				createdAt: out.createdAt.toISOString(),
				updatedAt: out.updatedAt.toISOString(),
			});
		},
	});
}
