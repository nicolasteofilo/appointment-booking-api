import bcryptjs from "bcryptjs";
import { describe, expect, it, vi } from "vitest";

vi.mock("bcryptjs", () => ({
	default: {
		hash: vi.fn().mockResolvedValue("any_hash"),
		compare: vi.fn().mockResolvedValue(true),
	},
}));

// this line need to be after mock of bcryptjs
import { BcryptPasswordHasher } from "./bcrypt-adapter";

const saltRounds = 10;
const makeSut = (): BcryptPasswordHasher => {
	return new BcryptPasswordHasher(saltRounds);
};

describe("Bcrypt Adapter", () => {
	describe("hash()", () => {
		it("should call hash() with correct values", async () => {
			const stu = makeSut();
			const hashSpy = vi.spyOn(bcryptjs, "hash");
			await stu.hash("any_value");
			expect(hashSpy).toHaveBeenCalledWith("any_value", saltRounds);
		});

		it("should return a valid hash", async () => {
			const stu = makeSut();
			const out = await stu.hash("any_value");
			expect(out).toBe("any_hash");
		});

		it("should throw if hash throws", async () => {
			const sut = makeSut();
			vi.spyOn(bcryptjs, "hash").mockReturnValueOnce(
				new Promise((_resolve, reject) => reject(new Error())) as any,
			);
			const promise = sut.hash("any_value");
			await expect(promise).rejects.toThrow();
		});
	});

	describe("compare()", () => {
		it("should call compare() with correct values", async () => {
			const stu = makeSut();
			const compareSpy = vi.spyOn(bcryptjs, "compare");
			await stu.compare("any_value", "any_hash");
			expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
		});

		it("should return true on compare success", async () => {
			const stu = makeSut();
			const out = await stu.compare("any_value", "any_hash");
			expect(out).toBe(true);
		});

		it("should return throw if compare throw", async () => {
			const sut = makeSut();
			vi.spyOn(bcryptjs, "compare").mockReturnValueOnce(
				new Promise((_resolve, reject) => reject(new Error())) as any,
			);
			const promise = sut.compare("any_value", "any_hash");
			await expect(promise).rejects.toThrow();
		});
	});
});
