import type { FastifyInstance } from "fastify";
import { registerUserFactory } from "@/infrastructure/factories/auth/register-user.factory";
import {
	type RegisterBody,
	registerSchema,
} from "@/infrastructure/http/schemas/auth.schema";

export async function authRoutes(app: FastifyInstance) {
	const registerUserUseCase = registerUserFactory();

	app.post("/register", async (req, reply) => {
		const body = registerSchema.parse(req.body) as RegisterBody;
		const out = await registerUserUseCase.execute(body);
		return reply.code(201).send(out);
	});
}
