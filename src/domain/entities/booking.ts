export type BookingStatus = "pending" | "confirmed" | "canceled";

export interface Booking {
	id: string;

	hostId: string; // provider / who receives the booking
	guestId: string; // client / who creates the booking

	startsAt: Date; // stored in UTC
	endsAt: Date; // stored in UTC

	status: BookingStatus;

	canceledAt: Date | null;
	cancelReason: string | null;

	title: string | null;
	notes: string | null;

	createdAt: Date;
	updatedAt: Date;
}
