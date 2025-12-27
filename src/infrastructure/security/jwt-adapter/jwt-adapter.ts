import jwt from "jsonwebtoken";
import type { TokenService } from "@/application/ports/services/auth/token-service";
import type { Decrypter } from "@/application/ports/services/security/decrypter";
import type { Encrypter } from "@/application/ports/services/security/encrypter";
import { AppError } from "@/domain/errors/app-error";

export class JwtAdapter implements Encrypter, Decrypter, TokenService {
	constructor(private readonly secret: string) {}

	async verifyAccessToken(token: string): Promise<{ userId: string }> {
		try {
			const value = await jwt.verify(token, this.secret);
			if (!value || typeof value !== "object" || !("id" in value)) {
				throw new AppError("Invalid token", 401, "INVALID_TOKEN");
			}
			if (typeof value.id !== "string") {
				throw new AppError("Invalid token", 401, "INVALID_TOKEN");
			}
			return {
				userId: value.id,
			};
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError("Invalid token", 401, "INVALID_TOKEN");
		}
	}

	async encrypt(value: string): Promise<string> {
		return await jwt.sign({ id: value }, this.secret, { expiresIn: "999d" });
	}

	async decrypt(token: string): Promise<string> {
		try {
			const value = await jwt.verify(token, this.secret);
			if (!value || typeof value !== "object" || !("id" in value)) {
				throw new AppError("Invalid token", 401, "INVALID_TOKEN");
			}
			if (typeof value.id !== "string") {
				throw new AppError("Invalid token", 401, "INVALID_TOKEN");
			}
			return value.id;
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw new AppError("Invalid token", 401, "INVALID_TOKEN");
		}
	}
}
