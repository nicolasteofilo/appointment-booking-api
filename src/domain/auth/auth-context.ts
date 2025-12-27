import type { UserRole } from "@/domain/entities/user";

export type AuthContext = {
	userId: string;
	role: UserRole;
};
