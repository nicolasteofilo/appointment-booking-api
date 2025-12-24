import { AppError } from "./app-error";

export class EmailAlreadyInUseError extends AppError {
	constructor() {
		super("Email already in use", 409, "EMAIL_ALREADY_IN_USE");
		this.name = "EmailAlreadyInUseError";
	}
}
