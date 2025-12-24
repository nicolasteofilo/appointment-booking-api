export interface RegisterUserInput {
	name: string;
	email: string;
	password: string;
}

export interface RegisterUserOutput {
	userId: string;
}
