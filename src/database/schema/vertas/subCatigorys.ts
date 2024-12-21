import { VERTAS } from "../schema";
import { uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { catigorysTable } from "./catigorys";

export const subCatigorysTable = VERTAS.table(
  "sub_catigorys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    catigoryId: uuid("catigory_id")
      .references(() => catigorysTable.id, {
        onDelete: "cascade"
      })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description").notNull(),
    poster: text("poster").notNull(),
    slug: varchar("slug").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdateFn(() => new Date())
  },
  (table) => {
    return {
      slugIdx: index("slug_idx_on_sub_catigory").on(table.slug),
      titleIdx: index("title_idx_on_sub_catigory").on(table.title),
      descriptionIdx: index("description_idx_on_sub_catigory").on(
        table.description
      )
    };
  }
);

export default subCatigorysTable;
