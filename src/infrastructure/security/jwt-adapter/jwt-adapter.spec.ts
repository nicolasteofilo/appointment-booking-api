import jsonwebtoken from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

vi.mock("jsonwebtoken", () => ({
	default: {
		sign: vi.fn().mockResolvedValue("any_token"),
		verify: vi.fn().mockResolvedValue("any_value"),
	},
}));

import { JwtAdapter } from "./jwt-adapter";

const secret = "ANY_SECRET_VALUE";

const makeSut = (): JwtAdapter => {
	return new JwtAdapter(secret);
};

describe("Jwt Adapter", () => {
	describe("sign()", () => {
		it("should call sign() with correct values", async () => {
			const sut = makeSut();
			const signSpy = vi.spyOn(jsonwebtoken, "sign");
			await sut.encrypt("any_id");
			expect(signSpy).toHaveBeenCalledWith(
				{
					id: "any_id",
				},
				"ANY_SECRET_VALUE",
				{
					expiresIn: "999d",
				},
			);
		});
		it("should return a token on sign success", async () => {
			const sut = makeSut();
			const out = await sut.encrypt("any_id");
			expect(out).toBe("any_token");
		});
		it("should throw if sign throws", async () => {
			const sut = makeSut();
			vi.spyOn(jsonwebtoken, "sign").mockImplementationOnce(() => {
				throw new Error();
			});
			const promise = sut.encrypt("any_id");
			await expect(promise).rejects.toThrow();
		});
	});
	describe("verify()", () => {
		it("should call verify() with correct values", async () => {
			const sut = makeSut();
			const verifySpy = vi.spyOn(jsonwebtoken, "verify");
			await sut.decrypt("any_token");
			expect(verifySpy).toHaveBeenCalledWith("any_token", secret);
		});
		it("should return a value on verify success", async () => {
			const sut = makeSut();
			const out = await sut.decrypt("any_token");
			expect(out).not.toBeNull();
			expect(out).toBe("any_value");
		});
		it("should throw if verify throws", async () => {
			const sut = makeSut();
			vi.spyOn(jsonwebtoken, "verify").mockImplementationOnce(() => {
				throw new Error();
			});
			const promise = sut.decrypt("any_token");
			await expect(promise).rejects.toThrow();
		});
	});
	describe("verifyAccessToken()", () => {
		it("should call verifyAccessToken with correct values", async () => {
			const sut = makeSut();
			const verifyAccessTokenSpy = vi.spyOn(jsonwebtoken, "verify");
			await sut.verifyAccessToken("any_token");
			expect(verifyAccessTokenSpy).toHaveBeenCalledWith("any_token", secret);
		});
		it("should return a object on verifyAccessToken success", async () => {
			const sut = makeSut();
			const out = await sut.verifyAccessToken("any_token");
			expect(out).toMatchObject({
				userId: "any_value",
			});
		});
		it("should throw if verifyAccessToken throws", async () => {
			const sut = makeSut();
			vi.spyOn(jsonwebtoken, "verify").mockImplementationOnce(() => {
				throw new Error();
			});
			const promise = sut.verifyAccessToken("any_token");
			await expect(promise).rejects.toThrow();
		});
	});
});
