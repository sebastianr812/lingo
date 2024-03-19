import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
// NOTE: we pass in the schema obj because it allows us to use drizzle's queries
// api (instead of "raw" sql) from drizzle
const db = drizzle(sql, { schema });

export default db;

