import { pgTable, time, uuid } from "drizzle-orm/pg-core";
import { availabilityOverrides } from "./availability-overrides";

export const availabilityOverrideIntervals = pgTable(
	"availability_override_intervals",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		overrideId: uuid("override_id")
			.notNull()
			.references(() => availabilityOverrides.id, { onDelete: "cascade" }),

		startTime: time("start_time").notNull(),
		endTime: time("end_time").notNull(),
	},
);
