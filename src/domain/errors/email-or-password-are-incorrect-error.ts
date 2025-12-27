import { AppError } from "./app-error";

export class EmailOrPasswordAreIncorrect extends AppError {
	constructor() {
		super(
			"Email or password are incorrect",
			401,
			"EMAIL_OR_PASSWORD_ARE_INCORRECT",
		);
		this.name = "EmailOrPasswordAreIncorrect";
	}
}
