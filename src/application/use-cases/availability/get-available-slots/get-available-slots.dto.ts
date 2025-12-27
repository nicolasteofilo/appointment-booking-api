export interface GetAvailableSlotsInput {
	hostId: string;
	from: string; // "YYYY-MM-DD"
	to: string; // "YYYY-MM-DD"
	slotMinutes: number; // e.g. 30
}

export type AvailableSlot = {
	startsAt: string; // ISO datetime (UTC)
	endsAt: string; // ISO datetime (UTC)
};

export interface GetAvailableSlotsOutput {
	hostId: string;
	from: string;
	to: string;
	slots: AvailableSlot[];
}
