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
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challenges);

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

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1,
                title: "Unit 1",
                description: "Learn the basics of Spanish",
                order: 1,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                title: "Nouns",
                order: 1,
            },
            {
                id: 2,
                unitId: 1,
                title: "Verbs",
                order: 2,
            },
            {
                id: 3,
                unitId: 1,
                title: "Verbs",
                order: 3,
            },
            {
                id: 4,
                unitId: 1,
                title: "Verbs",
                order: 4,
            },
            {
                id: 5,
                unitId: 1,
                title: "Verbs",
                order: 5,
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "the man"?',
            },
            {
                id: 2,
                lessonId: 1,
                type: "ASSIST",
                order: 2,
                question: '"the man"',
            },
            {
                id: 3,
                lessonId: 1,
                type: "SELECT",
                order: 3,
                question: 'Which one of these is "the robot"?',
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1,
                imageSrc: "/man.svg",
                correct: true,
                text: "El hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/woman.svg",
                correct: false,
                text: "La mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/robot.svg",
                correct: false,
                text: "El robot",
                audioSrc: "/es_robot.mp3",
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2,
                correct: true,
                text: "El hombre",
                audioSrc: "/es_man.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "La mujer",
                audioSrc: "/es_woman.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "El robot",
                audioSrc: "/es_robot.mp3",
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3,
                correct: false,
                text: "El hombre",
                audioSrc: "/es_man.mp3",
                imageSrc: "/man.svg",
            },
            {
                challengeId: 3,
                correct: false,
                text: "La mujer",
                audioSrc: "/es_woman.mp3",
                imageSrc: "/woman.svg"
            },
            {
                challengeId: 3,
                correct: true,
                text: "El robot",
                audioSrc: "/es_robot.mp3",
                imageSrc: "/robot.svg",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonId: 2,
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "the man"?',
            },
            {
                id: 5,
                lessonId: 2,
                type: "ASSIST",
                order: 2,
                question: '"the man"',
            },
            {
                id: 6,
                lessonId: 2,
                type: "SELECT",
                order: 3,
                question: 'Which one of these is "the robot"?',
            },
        ]);

        console.log("finished seeding db");
    } catch (e) {
        console.error(e);
        throw new Error("Failed to seed db");
    }
}
main();

