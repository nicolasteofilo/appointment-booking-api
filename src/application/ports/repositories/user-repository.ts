import type { User } from "@/domain/entities/user";
import type { Repository } from "./repository.interface";

export type NewUser = Omit<User, "id">;

export interface UserRepository
	extends Omit<Repository<User, string>, "insert"> {
	insert(entity: NewUser): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
}
