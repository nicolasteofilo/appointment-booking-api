import type { User } from "@/domain/entities/user";

export interface GetMeInput {
	userId: string;
}

export type GetMeOutput = Omit<User, "passwordHash">;
