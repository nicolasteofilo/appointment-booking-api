import "fastify";
import type { FastifyReply } from "fastify";
import type { AuthContext } from "@/domain/auth/auth-context";

declare module "fastify" {
	interface FastifyRequest {
		auth: AuthContext | null;
	}

	interface FastifyInstance {
		authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
		optionalAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}
