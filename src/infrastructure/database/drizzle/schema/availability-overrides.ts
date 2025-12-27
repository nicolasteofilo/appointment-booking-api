import { date, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const availabilityOverrides = pgTable("availability_overrides", {
	id: uuid("id").defaultRandom().primaryKey(),
	hostId: uuid("host_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),

	date: date("date").notNull(), // "2026-01-15"
	type: varchar("type", { length: 20 }).notNull(), // "off" | "custom"

	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});
