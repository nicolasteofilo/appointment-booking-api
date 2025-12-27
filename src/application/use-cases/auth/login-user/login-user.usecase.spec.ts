import { describe, expect, it, vi } from "vitest";
import type {
	NewUser,
	UserRepository,
} from "@/application/ports/repositories/user-repository";
import type { Encrypter } from "@/application/ports/services/encrypter";
import type { PasswordHasher } from "@/application/ports/services/password-hasher";
import type { User } from "@/domain/entities/user";
import type { LoginUserInput } from "./login-user.dto";
import { LoginUserUseCase } from "./login-user.usecase";

const makeUser = (overrides: Partial<User> = {}): User => ({
	id: "user-id",
	name: "John Doe",
	email: "john@example.com",
	passwordHash: "hashed_pass",
	createdAt: new Date(2024, 1, 1),
	updatedAt: new Date(2024, 1, 1),
	role: "user",
	...overrides,
});

const makeUserRepositoryStub = (user: User | null = makeUser()) => {
	const findByEmail = vi.fn(async () => user);
	const userRepositoryStub: UserRepository = {
		findById: vi.fn(async () => null),
		delete: vi.fn(async () => {}),
		update: vi.fn(async (u: User) => u),
		findByEmail,
		insert: vi.fn(async (entity: NewUser) => ({
			id: "uuid-1",
			...entity,
		})),
	};

	return { userRepositoryStub, findByEmail };
};

const makeHasherStub = (compareResult = true) => {
	const compare = vi.fn(async () => compareResult);
	const hash = vi.fn(async (plain: string) => `hashed:${plain}`);
	const hasherStub: PasswordHasher = {
		hash,
		compare,
	};

	return { hasherStub, compare };
};

const makeEncrypterStub = () => {
	const encrypt = vi.fn(async () => "access_token");
	const encrypterStub: Encrypter = {
		encrypt,
	};

	return { encrypterStub, encrypt };
};

interface SutTypes {
	useCase: LoginUserUseCase;
	findByEmail: ReturnType<typeof vi.fn>;
	compare: ReturnType<typeof vi.fn>;
	encrypt: ReturnType<typeof vi.fn>;
}

const makeSut = (options?: {
	user?: User | null;
	compareResult?: boolean;
}): SutTypes => {
	const { userRepositoryStub, findByEmail } = makeUserRepositoryStub(
		options?.user ?? makeUser(),
	);
	const { hasherStub, compare } = makeHasherStub(
		options?.compareResult ?? true,
	);
	const { encrypterStub, encrypt } = makeEncrypterStub();
	const useCase = new LoginUserUseCase(
		userRepositoryStub,
		hasherStub,
		encrypterStub,
	);

	return {
		useCase,
		findByEmail,
		compare,
		encrypt,
	};
};

describe("LoginUserUseCase", () => {
	it("should call UserRepository with correct email", async () => {
		const { useCase, findByEmail } = makeSut();
		const loginInput: LoginUserInput = {
			email: "john@example.com",
			password: "plain_pass",
		};

		await useCase.execute(loginInput);

		expect(findByEmail).toHaveBeenCalledWith(loginInput.email);
	});

	it("should call PasswordHasher with correct password data", async () => {
		const user = makeUser({ passwordHash: "stored_hash" });
		const { useCase, compare } = makeSut({ user });
		const loginInput: LoginUserInput = {
			email: "john@example.com",
			password: "plain_pass",
		};

		await useCase.execute(loginInput);

		expect(compare).toHaveBeenCalledWith("plain_pass", "stored_hash");
	});

	it("should call Encrypter with correct values", async () => {
		const user = makeUser({ id: "user-42" });
		const { useCase, encrypt } = makeSut({ user });
		const loginInput: LoginUserInput = {
			email: "john@example.com",
			password: "plain_pass",
		};

		await useCase.execute(loginInput);

		expect(encrypt).toHaveBeenCalledWith("user-42");
	});

	it("should return an access token when login is performed with correct credentials", async () => {
		const { useCase } = makeSut();

		const out = await useCase.execute({
			email: "john@example.com",
			password: "plain_pass",
		});

		expect(out.accessToken).toBe("access_token");
	});
});
