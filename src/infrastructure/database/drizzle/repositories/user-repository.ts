import { eq } from "drizzle-orm";
import type {
	NewUser,
	UserRepository,
} from "@/application/ports/repositories/user-repository";
import type { User } from "@/domain/entities/user";
import { db } from "../db";
import { users } from "../schema";

export class DrizzleUserRepository implements UserRepository {
	async findById(id: string): Promise<User | null> {
		const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
		return rows[0] ? this.toDomain(rows[0]) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const rows = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		return rows[0] ? this.toDomain(rows[0]) : null;
	}

	async insert(entity: NewUser): Promise<User> {
		const [row] = await db
			.insert(users)
			.values({
				name: entity.name,
				email: entity.email,
				passwordHash: entity.passwordHash,
				role: entity.role,
				createdAt: entity.createdAt,
				updatedAt: entity.updatedAt,
			})
			.returning();

		return this.toDomain(row);
	}

	async update(entity: User): Promise<User> {
		const rows = await db
			.update(users)
			.set({
				name: entity.name,
				email: entity.email,
				passwordHash: entity.passwordHash,
				role: entity.role,
				updatedAt: entity.updatedAt,
			})
			.where(eq(users.id, entity.id))
			.returning();

		return this.toDomain(rows[0]);
	}

	async delete(id: string): Promise<void> {
		await db.delete(users).where(eq(users.id, id));
	}

	private toDomain(row: typeof users.$inferSelect): User {
		return {
			id: row.id,
			name: row.name,
			email: row.email,
			passwordHash: row.passwordHash,
			role: row.role as User["role"],
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		};
	}
}
