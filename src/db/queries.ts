import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { challengeProgress, challenges, courses, units, userProgress } from "./schema";

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

export const getUnits = cache(async () => {
    const { userId } = auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress || !userProgress.activeCourseId) {
        return [];
    }

    // TODO: confirm if order is needed field
    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                // Only load data for the particular user ->
                                // if we do challengeProgress: true it loads all data for all users
                                where: eq(challengeProgress.userId, userId),
                            }
                        }
                    }
                }
            }
        }
    });

    // REFAC: this can be optimized with drizzle's regular syntax (SQL like)
    const normalizedData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            const allCompletedChallenges = lesson.challenges.every((cha) => {
                return cha.challengeProgress
                    && cha.challengeProgress.length > 0
                    && cha.challengeProgress.every((prog) => prog.completed);
            });
            return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;
});

export const getCourseProgress = cache(async () => {
    const {userId} = auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
        return null;
    }

    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            }
                        }
                    }
                }
            }
        }
    });
});

