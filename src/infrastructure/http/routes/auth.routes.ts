import type { FastifyInstance } from "fastify";
import type { LoginUserUseCase } from "@/application/use-cases/auth/login-user/login-user.usecase";
import type { RegisterUserUseCase } from "@/application/use-cases/auth/register-user/register-user.usecase";
import { loginUserFactory } from "@/infrastructure/factories/auth/login-user.factory";
import { registerUserFactory } from "@/infrastructure/factories/auth/register-user.factory";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

type AuthRoutesDeps = {
	registerUserUseCase?: RegisterUserUseCase;
	loginUserUseCase?: LoginUserUseCase;
};

export async function authRoutes(
	app: FastifyInstance,
	deps: AuthRoutesDeps = {},
) {
	const registerUserUseCase = deps.registerUserUseCase ?? registerUserFactory();
	const loginUserUseCase = deps.loginUserUseCase ?? loginUserFactory();

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

	// app.post(
	// 	"/admin",
	// 	{ preHandler: [app.authenticate, requireRole(["guest"])] },
	// 	(_req, reply) => {
	// 		return reply.code(200).send({
	// 			ok: true,
	// 		});
	// 	},
	// );
}
