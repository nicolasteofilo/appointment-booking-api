import { RegisterUserUseCase } from "@/application/use-cases/auth/register-user/register-user.usecase";
import { DrizzleUserRepository } from "@/infrastructure/database/drizzle/repositories/user-repository";
import { BcryptPasswordHasher } from "@/infrastructure/security/bcrypt-password-hasher";

export function registerUserFactory() {
	const usersRepo = new DrizzleUserRepository();
	const hasher = new BcryptPasswordHasher(10);

	return new RegisterUserUseCase(usersRepo, hasher);
}
