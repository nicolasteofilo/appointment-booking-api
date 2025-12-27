import type { FastifyRequest } from "fastify";
import type { UserRole } from "@/domain/entities/user";
import { AppError } from "@/domain/errors/app-error";

export function requireRole(allowed: UserRole[]) {
	return async (req: FastifyRequest) => {
		if (!req.auth) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
		if (!allowed.includes(req.auth.role))
			throw new AppError("Forbidden", 403, "FORBIDDEN");
	};
}
