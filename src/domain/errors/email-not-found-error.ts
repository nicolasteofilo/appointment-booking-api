import { AppError } from "./app-error";

export class EmailNotFoundError extends AppError {
	constructor() {
		super("Email not found", 404, "EMAIL_NOT_FOUND");
		this.name = "EmailNotFoundError";
	}
}
