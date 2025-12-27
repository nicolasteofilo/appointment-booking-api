import type { UserRepository } from "@/application/ports/repositories/user-repository";
import type { Encrypter } from "@/application/ports/services/security/encrypter";
import type { PasswordHasher } from "@/application/ports/services/security/password-hasher";
import { EmailOrPasswordAreIncorrect } from "@/domain/errors/email-or-password-are-incorrect-error";
import type { LoginUserInput, LoginUserOutput } from "./login-user.dto";

export class LoginUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: PasswordHasher,
		private readonly encrypter: Encrypter,
	) {}

	async execute(input: LoginUserInput): Promise<LoginUserOutput> {
		const email = input.email;
		const password = input.password;

		const existingUser = await this.userRepository.findByEmail(email);
		if (!existingUser) {
			throw new EmailOrPasswordAreIncorrect();
		}

		const passwordHasRight = await this.hasher.compare(
			password,
			existingUser.passwordHash,
		);

		if (!passwordHasRight) {
			throw new EmailOrPasswordAreIncorrect();
		}

		const accessToken = await this.encrypter.encrypt(existingUser.id);
		return {
			accessToken,
		};
	}
}
