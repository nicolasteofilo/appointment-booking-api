import { AuthService } from "@/application/ports/services/auth/auth-service";
import { DrizzleUserRepository } from "@/infrastructure/database/drizzle/repositories/user-repository";
import { env } from "@/infrastructure/env";
import { JwtAdapter } from "@/infrastructure/security/jwt-adapter/jwt-adapter";

export function authServiceFactory() {
	const usersRepo = new DrizzleUserRepository();
	const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
	return new AuthService(jwtAdapter, usersRepo);
}
