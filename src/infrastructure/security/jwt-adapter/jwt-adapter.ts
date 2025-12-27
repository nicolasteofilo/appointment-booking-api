import jwt from "jsonwebtoken";
import type { Decrypter } from "@/application/ports/services/decrypter";
import type { Encrypter } from "@/application/ports/services/encrypter";

export class JwtAdapter implements Encrypter, Decrypter {
	constructor(private readonly secret: string) {}

	async encrypt(value: string): Promise<string> {
		return jwt.sign({ id: value }, this.secret);
	}

	async decrypt(token: string): Promise<string> {
		const value = await jwt.verify(token, this.secret);
		return value as string;
	}
}
