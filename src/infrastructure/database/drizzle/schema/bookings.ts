import {
	index,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const bookings = pgTable(
	"bookings",
	{
		id: uuid("id").defaultRandom().primaryKey(),

		hostId: uuid("host_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		guestId: uuid("guest_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		startsAt: timestamp("starts_at", {
			withTimezone: true,
			mode: "date",
		}).notNull(),
		endsAt: timestamp("ends_at", {
			withTimezone: true,
			mode: "date",
		}).notNull(),

		status: varchar("status", { length: 20 }).notNull().default("pending"), // pending|confirmed|canceled

		canceledAt: timestamp("canceled_at", { withTimezone: true, mode: "date" }),
		cancelReason: text("cancel_reason"),

		title: varchar("title", { length: 120 }),
		notes: text("notes"),

		createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(t) => ({
		hostStartsAtIdx: index("bookings_host_starts_at_idx").on(
			t.hostId,
			t.startsAt,
		),
		guestIdx: index("bookings_guest_idx").on(t.guestId),
	}),
);
