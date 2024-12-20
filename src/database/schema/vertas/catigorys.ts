import { VERTAS } from "../schema";
import { uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const catigorysTable = VERTAS.table(
  "catigorys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    poster: text("poster").notNull(),
    slug: varchar("slug").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdateFn(() => new Date())
  },
  (table) => {
    return {
      slugIdx: index("slug_idx_on_catigory").on(table.slug),
      titleIdx: index("title_idx_on_catigory").on(table.title),
      descriptionIdx: index("description_idx_on_catigory").on(table.description)
    };
  }
);

export default catigorysTable;
