import { RegisterUserUseCase } from "@/application/use-cases/auth/register-user/register-user.usecase";
import { DrizzleUserRepository } from "@/infrastructure/database/drizzle/repositories/user-repository";
import { BcryptPasswordHasher } from "@/infrastructure/security/bcrypt-adapter/bcrypt-adapter";

export function registerUserFactory() {
	const usersRepo = new DrizzleUserRepository();
	const bcryptAdapter = new BcryptPasswordHasher(10);

	return new RegisterUserUseCase(usersRepo, bcryptAdapter);
}
