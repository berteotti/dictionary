import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const word = pgTable("Word", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Word = InferSelectModel<typeof word>;
