export type UserRole = "admin" | "user" | "guest";

export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}
