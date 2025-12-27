import type { Weekday } from "@/domain/entities/weekly-availability-rule";

export type TimeRangeOutput = {
	startTime: string; // "HH:MM"
	endTime: string; // "HH:MM"
};

export interface GetWeeklyAvailabilityOutput {
	hostId: string;
	timezone: string; // from User
	days: Partial<Record<Weekday, TimeRangeOutput[]>>;
}
