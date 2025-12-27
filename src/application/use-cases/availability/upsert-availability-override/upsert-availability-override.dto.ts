import type {
	AvailabilityOverrideType,
	OverrideInterval,
} from "@/domain/entities/availability-override";

export interface UpsertAvailabilityOverrideInput {
	hostId: string;
	date: string; // "YYYY-MM-DD"
	type: AvailabilityOverrideType;

	// required if type === "custom"
	// must be empty if type === "off"
	intervals: OverrideInterval[];
}

export interface UpsertAvailabilityOverrideOutput {
	ok: true;
}
