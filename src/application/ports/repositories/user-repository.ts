import type { User } from "@/domain/entities/user";
import type { Repository } from "./repository.interface";

export interface UserRepository extends Repository<User, string> {
	findByEmail(email: string): Promise<User | null>;
}
