export type AvailabilityOverrideType = "off" | "custom";

export type OverrideInterval = {
	startTime: string; // "HH:MM"
	endTime: string; // "HH:MM"
};

export interface AvailabilityOverride {
	id: string;
	hostId: string;

	// calendar day, safer than Date in JS for this purpose
	date: string; // "YYYY-MM-DD"

	type: AvailabilityOverrideType;

	// for type === "custom": must have >= 1 interval
	// for type === "off": must be empty
	intervals: OverrideInterval[];

	createdAt: Date;
	updatedAt: Date;
}
