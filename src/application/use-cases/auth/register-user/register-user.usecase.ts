import type { UserRepository } from "@/application/ports/repositories/user-repository";
import type { PasswordHasher } from "@/application/ports/services/password-hasher";
import { EmailAlreadyInUseError } from "@/domain/errors/email-already-in-use-error";

import type {
	RegisterUserInput,
	RegisterUserOutput,
} from "./register-user.dto";

export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: PasswordHasher,
	) {}

	async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
		const email = input.email.trim().toLowerCase();
		const name = input.name.trimEnd().trimStart();

		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new EmailAlreadyInUseError();
		}

		const passwordHash = await this.hasher.hash(input.password);
		const now = new Date();

		const newUser = await this.userRepository.insert({
			name,
			email: email,
			passwordHash,
			role: "user",
			createdAt: now,
			updatedAt: now,
		});

		return {
			userId: newUser.id,
		};
	}
}
