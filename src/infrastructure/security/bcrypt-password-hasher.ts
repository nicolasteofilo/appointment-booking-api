import bcrypt from "bcrypt";
import type { PasswordHasher } from "../../application/ports/services/password-hasher";

export class BcryptPasswordHasher implements PasswordHasher {
	constructor(private readonly saltRounds = 10) {}

	hash(plain: string): Promise<string> {
		return bcrypt.hash(plain, this.saltRounds);
	}
	compare(plain: string, hash: string): Promise<boolean> {
		return bcrypt.compare(plain, hash);
	}
}
