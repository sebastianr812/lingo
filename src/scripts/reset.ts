import "dotenv/config";
import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

async function main() {
    try {
        console.log("resetting the db");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challenges);
        await db.delete(schema.userSubscription);


        console.log("finished resetting the db");
    } catch (e) {
        console.error(e);
        throw new Error("Failed to seed db");
    }
}
main();

