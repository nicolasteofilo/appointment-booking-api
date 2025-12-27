import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const bookings = pgTable(
	"bookings",
	{
		id: uuid("id").defaultRandom().primaryKey(),

		hostId: uuid("host_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		guestUserId: uuid("guest_user_id").references(() => users.id, {
			onDelete: "set null",
		}),

		guestName: varchar("guest_name", { length: 120 }),
		guestEmail: varchar("guest_email", { length: 255 }),

		startsAt: timestamp("starts_at", {
			withTimezone: true,
			mode: "date",
		}).notNull(),
		endsAt: timestamp("ends_at", {
			withTimezone: true,
			mode: "date",
		}).notNull(),

		status: varchar("status", { length: 20 }).notNull().default("pending"),

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
		guestUserIdx: index("bookings_guest_user_idx").on(t.guestUserId),
		guestEmailIdx: index("bookings_guest_email_idx").on(t.guestEmail),
	}),
);
