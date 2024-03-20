import "dotenv/config";
import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

async function main() {
    try {
        console.log("seeding db");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imageSrc: "/es.svg",
            },
            {
                id: 2,
                title: "French",
                imageSrc: "/fr.svg",
            },
            {
                id: 3,
                title: "Croatian",
                imageSrc: "/hr.svg",
            },
            {
                id: 4,
                title: "Japanese",
                imageSrc: "/jp.svg",
            },
            {
                id: 5,
                title: "Italian",
                imageSrc: "/it.svg",
            },
        ]);

        console.log("finished seeding db");
    } catch (e) {
        console.error(e);
        throw new Error("Failed to seed db");
    }
}
main();

