import { faker } from "@faker-js/faker";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "@/infrastructure/http/build-app";
import { postJson } from "./utils/post-json";

let app: FastifyInstance;
let baseUrl = "";

const getJson = async (url: string, headers?: Record<string, string>) => {
	const res = await fetch(url, {
		method: "GET",
		headers,
	});
	const text = await res.text();
	const json = text ? JSON.parse(text) : null;
	return { res, json };
};

beforeAll(async () => {
	app = buildApp({ logger: false });

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
		const user = {
			name: faker.internet.username(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		};
		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/register`,
			user,
		);
		expect(res.status).toBe(201);
		expect(json).toHaveProperty("userId");
	});

	it("POST /auth/register -> 400: should return 400 when body is invalid", async () => {
		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/register`,
			{
				name: faker.internet.username(),
				email: "not-an-email",
				password: faker.internet.password(),
			},
		);

		expect(res.status).toBe(400);
		expect(json).toHaveProperty("message", "Validation error");
		expect(json).toHaveProperty("issues");
	});

	it("POST /auth/register -> 400: should return 400 when password is too short", async () => {
		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/register`,
			{
				name: faker.internet.username(),
				email: faker.internet.email(),
				password: "123",
			},
		);

		expect(res.status).toBe(400);
		expect(json).toHaveProperty("message", "Validation error");
		expect(json).toHaveProperty("issues");
	});

	it("POST /auth/register -> 409: should return 409 when email is already registered", async () => {
		const user = {
			name: faker.internet.username(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		};

		await postJson<{ userId: string }>(`${baseUrl}/auth/register`, user);

		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/register`,
			{
				name: faker.internet.username(),
				email: user.email,
				password: faker.internet.password(),
			},
		);

		expect(res.status).toBe(409);
		expect(json).toHaveProperty("message");
		expect(json).toHaveProperty("code");
	});

	it("POST /auth/login -> 200: should return a access token on login success", async () => {
		const user = {
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "87654321",
		};

		await postJson<{ userId: string }>(`${baseUrl}/auth/register`, user);

		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/login`,
			{
				email: user.email,
				password: user.password,
			},
		);

		expect(res.status).toBe(200);
		expect(json).toHaveProperty("accessToken");
	});

	it("POST /auth/login -> 401: should return 409 if email don't exists", async () => {
		const user = {
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "87654321",
		};

		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/login`,
			{
				email: user.email,
				password: user.password,
			},
		);

		expect(res.status).toBe(401);
		expect(json).toMatchObject({
			message: "Email or password are incorrect",
			code: "EMAIL_OR_PASSWORD_ARE_INCORRECT",
		});
	});

	it("POST /auth/login -> 401: should return 409 if password is incorrect", async () => {
		const user = {
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "87654321",
		};

		await postJson<{ userId: string }>(`${baseUrl}/auth/register`, user);

		const { res, json } = await postJson<{ userId: string }>(
			`${baseUrl}/auth/login`,
			{
				email: user.email,
				password: "any_password",
			},
		);

		expect(res.status).toBe(401);
		expect(json).toMatchObject({
			message: "Email or password are incorrect",
			code: "EMAIL_OR_PASSWORD_ARE_INCORRECT",
		});
	});

	it("GET /auth/me -> 200: should return the logged user data", async () => {
		const user = {
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "87654321",
		};

		await postJson<{ userId: string }>(`${baseUrl}/auth/register`, user);

		const login = await postJson<{ accessToken: string }>(
			`${baseUrl}/auth/login`,
			{
				email: user.email,
				password: user.password,
			},
		);

		const { res, json } = await getJson(`${baseUrl}/auth/me`, {
			authorization: `Bearer ${login.json.accessToken}`,
		});

		expect(res.status).toBe(200);
		expect(json).toMatchObject({
			email: user.email,
			name: user.name,
			role: "user",
		});
		expect(json).not.toHaveProperty("passwordHash");
	});

	it("GET /auth/me -> 401: should return 401 when token is missing", async () => {
		const { res, json } = await getJson(`${baseUrl}/auth/me`);

		expect(res.status).toBe(401);
		expect(json).toMatchObject({
			message: "Missing token",
			code: "MISSING_TOKEN",
		});
	});

	it("GET /auth/me -> 401: should return 401 when token is invalid", async () => {
		const { res, json } = await getJson(`${baseUrl}/auth/me`, {
			authorization: "Bearer invalid.token.value",
		});

		expect(res.status).toBe(401);
		expect(json).toMatchObject({
			message: "Invalid token",
			code: "INVALID_TOKEN",
		});
	});
});
