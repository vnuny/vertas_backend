import { VERTAS } from "../schema";
import {
  uuid,
  varchar,
  text,
  timestamp,
  index,
  jsonb
} from "drizzle-orm/pg-core";
import { subCatigorysTable } from "./subCatigorys";

export const articalsTable = VERTAS.table(
  "articals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subCatigoryId: uuid("catigory_id").references(() => subCatigorysTable.id, {
      onDelete: "cascade"
    }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    poster: text("poster").notNull(),
    slug: varchar("slug").notNull(),
    blocks: jsonb("blocks").notNull(),
    tags: varchar("tags", { length: 255 }).array(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdateFn(() => new Date())
  },
  (table) => {
    return {
      slugIdx: index("slug_idx_on_artical").on(table.slug),
      titleIdx: index("title_idx_on_artical").on(table.title),
      descriptionIdx: index("description_idx_on_artical").on(table.description)
    };
  }
);

export default articalsTable;
