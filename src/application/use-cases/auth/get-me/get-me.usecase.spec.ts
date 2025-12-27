import { describe, expect, it, vi } from "vitest";
import type {
	NewUser,
	UserRepository,
} from "@/application/ports/repositories/user-repository";
import type { User } from "@/domain/entities/user";
import type { GetMeInput } from "./get-me.dto";
import { GetMeUseCase } from "./get-me.usecase";

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
	const findById = vi.fn(async () => user);
	const userRepositoryStub: UserRepository = {
		findById,
		delete: vi.fn(async () => {}),
		update: vi.fn(async (u: User) => u),
		findByEmail,
		insert: vi.fn(async (entity: NewUser) => ({
			id: "uuid-1",
			...entity,
		})),
	};

	return { userRepositoryStub, findByEmail, findById };
};

interface SutTypes {
	useCase: GetMeUseCase;
	findById: ReturnType<typeof vi.fn>;
}

const makeSut = (options?: {
	user?: User | null;
	compareResult?: boolean;
}): SutTypes => {
	const { userRepositoryStub, findById } = makeUserRepositoryStub(
		options?.user ?? makeUser(),
	);

	const useCase = new GetMeUseCase(userRepositoryStub);

	return {
		useCase,
		findById,
	};
};

describe("GetMeUseCase", () => {
	it("should call UserRepository with correct id", async () => {
		const { useCase, findById } = makeSut();
		const getMeInput: GetMeInput = {
			userId: "user-id",
		};
		await useCase.execute(getMeInput);
		expect(findById).toHaveBeenCalledWith(getMeInput.userId);
	});

	it("should return a valid user information when the user exists", async () => {
		const sut = makeSut();
		const out = await sut.useCase.execute({
			userId: "user_id",
		});
		expect(out).toHaveProperty("name");
		expect(out).toHaveProperty("email");
	});
});
