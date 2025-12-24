import type { FastifyInstance } from "fastify";
import type { RegisterUserUseCase } from "@/application/use-cases/auth/register-user/register-user.usecase";
import { registerUserFactory } from "@/infrastructure/factories/auth/register-user.factory";
import { registerSchema } from "../schemas/auth.schema";

type AuthRoutesDeps = {
	registerUserUseCase?: RegisterUserUseCase;
};

export async function authRoutes(
	app: FastifyInstance,
	deps: AuthRoutesDeps = {},
) {
	const registerUserUseCase = deps.registerUserUseCase ?? registerUserFactory();

	app.post("/register", async (req, reply) => {
		const body = registerSchema.parse(req.body);
		const out = await registerUserUseCase.execute(body);
		return reply.code(201).send(out);
	});
}
