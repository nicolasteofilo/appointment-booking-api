import type { UserRepository } from "@/application/ports/repositories/user-repository";
import type { AuthContext } from "@/domain/auth/auth-context";
import { AppError } from "@/domain/errors/app-error";
import type { TokenService } from "./token-service";

export class AuthService {
	constructor(
		private readonly tokens: TokenService,
		private readonly users: UserRepository,
	) {}

	async authenticate(token: string): Promise<AuthContext> {
		const payload = await this.tokens.verifyAccessToken(token);

		const user = await this.users.findById(payload.userId);
		if (!user) throw new AppError("User not found", 401, "USER_NOT_FOUND");

		return { userId: user.id, role: user.role };
	}
}
