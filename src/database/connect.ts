import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as Schema from "./schema";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!
});

const db = drizzle(pool, { schema: Schema });

export default db;
