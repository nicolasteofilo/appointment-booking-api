import jwt from "jsonwebtoken";
import type { TokenService } from "@/application/ports/services/auth/token-service";
import type { Decrypter } from "@/application/ports/services/security/decrypter";
import type { Encrypter } from "@/application/ports/services/security/encrypter";

export class JwtAdapter implements Encrypter, Decrypter, TokenService {
	constructor(private readonly secret: string) {}

	async verifyAccessToken(token: string): Promise<{ userId: string }> {
		const value = jwt.verify(token, this.secret);
		return {
			userId: value as string,
		};
	}

	async encrypt(value: string): Promise<string> {
		return jwt.sign({ id: value }, this.secret, { expiresIn: "999d" });
	}

	async decrypt(token: string): Promise<string> {
		const value = jwt.verify(token, this.secret);
		return value as string;
	}
}
