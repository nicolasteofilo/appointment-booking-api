import { describe, expect, it } from "vitest";
import type {
	NewUser,
	UserRepository,
} from "@/application/ports/repositories/user-repository";
import type { PasswordHasher } from "@/application/ports/services/password-hasher";
import type { User } from "@/domain/entities/user";
import { RegisterUserUseCase } from "./register-user.usecase";

function makeRepoFake() {
	const byEmail = new Map<string, User>();

	const repo: UserRepository = {
		async findById() {
			return null;
		},
		async delete() {},
		async update(u: User) {
			return u;
		},
		async findByEmail(email: string) {
			return byEmail.get(email) ?? null;
		},
		async insert(entity: NewUser) {
			const created: User = {
				id: "uuid-1",
				...entity,
			};
			byEmail.set(created.email, created);
			return created;
		},
	};

	return repo;
}

const hasherFake: PasswordHasher = {
	async hash(plain: string) {
		return `hashed:${plain}`;
	},
	async compare() {
		return true;
	},
};

describe("RegisterUserUseCase", () => {
	it("should register a new user and return userId", async () => {
		const repo = makeRepoFake();
		const useCase = new RegisterUserUseCase(repo, hasherFake);

		const out = await useCase.execute({
			name: "  Nicolas  ",
			email: "  NICOLAS@TEST.COM ",
			password: "12345678",
		});

		expect(out.userId).toBe("uuid-1");
	});
});
