import { GetMeUseCase } from "@/application/use-cases/auth/get-me/get-me.usecase";
import { DrizzleUserRepository } from "@/infrastructure/database/drizzle/repositories/user-repository";

export function getMeFactory() {
	const usersRepo = new DrizzleUserRepository();
	return new GetMeUseCase(usersRepo);
}
