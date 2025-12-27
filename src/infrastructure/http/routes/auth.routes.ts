import type { FastifyInstance } from "fastify";
import type { GetMeUseCase } from "@/application/use-cases/auth/get-me/get-me.usecase";
import type { LoginUserUseCase } from "@/application/use-cases/auth/login-user/login-user.usecase";
import type { RegisterUserUseCase } from "@/application/use-cases/auth/register-user/register-user.usecase";
import { getMeFactory } from "@/infrastructure/factories/auth/get-me.factory";
import { loginUserFactory } from "@/infrastructure/factories/auth/login-user.factory";
import { registerUserFactory } from "@/infrastructure/factories/auth/register-user.factory";
import { requireRole } from "../guards/require-role.guard";
import { loginSchema, meSchema, registerSchema } from "../schemas/auth.schema";

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

	app.post("/register", async (req, reply) => {
		const body = registerSchema.parse(req.body);
		const out = await registerUserUseCase.execute(body);
		return reply.code(201).send(out);
	});

	app.post("/login", async (req, reply) => {
		const body = loginSchema.parse(req.body);
		const out = await loginUserUseCase.execute(body);
		return reply.code(200).send(out);
	});

	app.get(
		"/me",
		{ preHandler: [app.authenticate, requireRole(["admin", "user"])] },
		async (req, reply) => {
			const content = meSchema.parse(req.auth);
			const out = await getMeUseCase.execute(content);
			return reply.code(200).send(out);
		},
	);
}
