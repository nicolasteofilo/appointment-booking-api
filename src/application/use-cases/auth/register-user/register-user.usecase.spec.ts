import { describe, expect, it } from "vitest";
import type {
	NewUser,
	UserRepository,
} from "@/application/ports/repositories/user-repository";
import type { PasswordHasher } from "@/application/ports/services/security/password-hasher";
import type { User } from "@/domain/entities/user";
import { RegisterUserUseCase } from "./register-user.usecase";

function makeUsersRepoFake() {
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
		const repo = makeUsersRepoFake();
		const useCase = new RegisterUserUseCase(repo, hasherFake);

		const out = await useCase.execute({
			name: "  John Doe  ",
			email: "  johndoe@TEST.COM ",
			password: "12345678",
		});

		expect(out.userId).toBe("uuid-1");
	});

	it("should not allow to register with an email that is already in use", async () => {
		const repo = makeUsersRepoFake();
		const useCase = new RegisterUserUseCase(repo, hasherFake);

		await useCase.execute({
			name: "John Doe",
			email: "johndoe@test.com",
			password: "12345678",
		});

		await expect(
			useCase.execute({
				name: "Other",
				email: "johndoe@test.com",
				password: "12345678",
			}),
		).rejects.toMatchObject({ statusCode: 409 });
	});

	it("should trim name and normalize email", async () => {
		const repo = makeUsersRepoFake();
		const useCase = new RegisterUserUseCase(repo, hasherFake);

		await useCase.execute({
			name: "  John Doe  ",
			email: "  johndoe@TEST.COM ",
			password: "12345678",
		});

		const user = await repo.findByEmail("johndoe@test.com");
		expect(user).not.toBeNull();
		expect(user?.name).toBe("John Doe");
		expect(user?.email).toBe("johndoe@test.com");
	});
});
