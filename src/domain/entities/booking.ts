export type BookingStatus = "pending" | "confirmed" | "canceled";

export interface Booking {
	id: string;

	hostId: string;

	guestUserId: string | null; // authenticated users
	guestName: string | null; // not authenticated users
	guestEmail: string | null; // not authenticated users

	startsAt: Date;
	endsAt: Date;

	status: "pending" | "confirmed" | "canceled";

	createdAt: Date;
	updatedAt: Date;
}
