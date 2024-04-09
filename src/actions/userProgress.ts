"use server"; // always use use server when defining server actions

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const POINTS_TO_REFILL = 10;


export async function upsertUserProgress(courseId: number) {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("unauthorized")
    }

    const course = await getCourseById(courseId);
    if (!course) {
        throw new Error("course not found");
    }
    // TODO: uncomment once we add units table and lessons table
    /*
        if (!course.units.length || !course.units[0].lessons.length) {
            throw new Error("course is empty");
        }
    */

    const existingUserProgress = await getUserProgress();
    // User already has userProgress for a course, we can just update it
    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.svg",
        });
        // we just updated values -> revalidate the cache
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId: userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
    });
    // we need to revalidate the cache becuase new values inserted
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
}

export async function reduceHearts(challengeId: number) {
    const { userId } = auth();

    if (!userId) {
        throw new Error("unauthorized");
    }

    const currentUserProgress = await getUserProgress();

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
        throw new Error("no challenge found");
    }

    const lessonId = challenge.lessonId;
    // TODO: get user subscription status

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        ),
    });

    const isPractice = !!existingChallengeProgress;

    if (isPractice) {
        return { error: "practice" };
    }

    if (!currentUserProgress) {
        throw new Error("user progress not found dummy");
    }
    // TODO: handle subscription

    if (currentUserProgress.hearts === 0) {
        return { error: "hearts" };
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
}

export async function refillHearts() {
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("user progress not found");
    }

    if (currentUserProgress.hearts === 5) {
        throw new Error("hearts are already full");
    }

    if (currentUserProgress.points < POINTS_TO_REFILL) {
        throw new Error("insufficient points");
    }

    await db.update(userProgress).set({
        hearts: 5,
        points: currentUserProgress.points - POINTS_TO_REFILL
    }).where(eq(userProgress.userId, currentUserProgress.userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
}


