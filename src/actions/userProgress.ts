"use server"; // always use use server when defining server actions
import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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

