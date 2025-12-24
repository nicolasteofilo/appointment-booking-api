import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "@/infrastructure/http/build-app";
import { authRoutes } from "@/infrastructure/http/routes/auth.routes";

let app: FastifyInstance;
let baseUrl = "";

beforeAll(async () => {
	app = buildApp();
	app.register(authRoutes, { prefix: "/auth" });

	await app.listen({ host: "127.0.0.1", port: 0 });

	const address = app.server.address();
	if (!address || typeof address === "string") {
		throw new Error("Unexpected server address");
	}

	baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
	await app.close();
});

describe("E2E HTTP /auth", () => {
	it("POST /auth/register -> 201: should register a new user and return the userId", async () => {
		const res = await fetch(`${baseUrl}/auth/register`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: "John Doe",
				email: "johndoe@test.com",
				password: "12345678",
			}),
		});

		expect(res.status).toBe(201);
		const json = await res.json();
		expect(json).toHaveProperty("userId");
	});

	it("POST /auth/register -> 400: should return 400 when body is invalid", async () => {
		const res = await fetch(`${baseUrl}/auth/register`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: "John Doe",
				email: "not-an-email",
				password: "12345678",
			}),
		});

		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json).toHaveProperty("message", "Validation error");
		expect(json).toHaveProperty("issues");
	});

	it("POST /auth/register -> 400: should return 400 when password is too short", async () => {
		const res = await fetch(`${baseUrl}/auth/register`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: "John Doe",
				email: "johndoe@test.com",
				password: "123",
			}),
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json).toHaveProperty("message", "Validation error");
		expect(json).toHaveProperty("issues");
	});

	it("POST /auth/register -> 409: should return 409 when email is already registered", async () => {
		// First registration
		await fetch(`${baseUrl}/auth/register`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: "John Doe",
				email: "johndoe@test.com",
				password: "12345678",
			}),
		});

		// Second registration with the same email
		const res = await fetch(`${baseUrl}/auth/register`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: "John Doe",
				email: "johndoe@test.com",
				password: "12345678",
			}),
		});

		expect(res.status).toBe(409);
		const json = await res.json();
		expect(json).toHaveProperty("message");
		expect(json).toHaveProperty("code");
	});
});
