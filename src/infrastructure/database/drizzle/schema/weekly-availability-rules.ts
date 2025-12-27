import {
	boolean,
	pgTable,
	smallint,
	time,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const weeklyAvailabilityRules = pgTable("weekly_availability_rules", {
	id: uuid("id").defaultRandom().primaryKey(),
	hostId: uuid("host_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),

	weekday: smallint("weekday").notNull(), // 0=Sun ... 6=Sat
	startTime: time("start_time").notNull(), // "09:00:00"
	endTime: time("end_time").notNull(), // "12:00:00"

	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});
