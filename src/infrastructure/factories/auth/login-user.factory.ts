import { LoginUserUseCase } from "@/application/use-cases/auth/login-user/login-user.usecase";
import { DrizzleUserRepository } from "@/infrastructure/database/drizzle/repositories/user-repository";
import { env } from "@/infrastructure/env";
import { BcryptPasswordHasher } from "@/infrastructure/security/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "@/infrastructure/security/jwt-adapter/jwt-adapter";

export function loginUserFactory() {
	const usersRepo = new DrizzleUserRepository();
	const bcryptAdapter = new BcryptPasswordHasher(10);
	const jwtAdapter = new JwtAdapter(env.JWT_SECRET);

	return new LoginUserUseCase(usersRepo, bcryptAdapter, jwtAdapter);
}
