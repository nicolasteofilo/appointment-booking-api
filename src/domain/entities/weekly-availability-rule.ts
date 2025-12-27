export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun ... 6=Sat

export interface WeeklyAvailabilityRule {
	id: string;
	hostId: string;

	weekday: Weekday;

	// time-of-day (no date)
	startTime: string; // "HH:MM"
	endTime: string; // "HH:MM"

	isActive: boolean;

	createdAt: Date;
	updatedAt: Date;
}
