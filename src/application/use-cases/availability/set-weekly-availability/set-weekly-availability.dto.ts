import type { Weekday } from "@/domain/entities/weekly-availability-rule";

export type TimeRangeInput = {
	startTime: string; // "HH:MM"
	endTime: string; // "HH:MM"
};

export interface SetWeeklyAvailabilityInput {
	hostId: string;

	// UI sends weekdays with one or more ranges per day
	days: Partial<Record<Weekday, TimeRangeInput[]>>;
}

export interface SetWeeklyAvailabilityOutput {
	ok: true;
}
