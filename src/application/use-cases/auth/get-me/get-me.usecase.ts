import type { UserRepository } from "@/application/ports/repositories/user-repository";
import { UserNotFoundError } from "@/domain/errors/user-not-found-error";
import type { GetMeInput, GetMeOutput } from "./get-me.dto";

export class GetMeUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(input: GetMeInput): Promise<GetMeOutput> {
		const id = input.userId;

		const existingUser = await this.userRepository.findById(id);
		if (!existingUser) {
			throw new UserNotFoundError();
		}

		return {
			id: existingUser.id,
			email: existingUser.email,
			name: existingUser.name,
			role: existingUser.role,
			createdAt: existingUser.createdAt,
			updatedAt: existingUser.updatedAt,
		};
	}
}
