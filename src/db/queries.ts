import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { courses, userProgress } from "./schema";

export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();
    return data;
});

export const getUserProgress = cache(async () => {
    const { userId } = auth();
    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        // we find the userId in the userPro table that matches the authenticated user
        where: eq(userProgress.userId, userId),
        // this does the join for active course of that user
        with: {
            activeCourse: true
        }
    });
    return data;
});

export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
        // TODO: populate units and lessons
    });
    return data;
});

