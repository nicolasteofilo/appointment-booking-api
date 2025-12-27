export interface CreateBookingInput {
	hostId: string;
	startsAt: string; // ISO
	endsAt: string; // ISO

	// se logado:
	guestUserId?: string;

	// se visitante:
	guestName?: string;
	guestEmail?: string;
}

export interface CreateBookingOutput {
	bookingId: string;
}
