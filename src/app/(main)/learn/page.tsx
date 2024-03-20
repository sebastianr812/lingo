import { CourseHeader } from "@/components/CourseHeader";
import { FeedWrapper } from "@/components/FeedWrapper";
import { StickyWrapper } from "@/components/StickyWrapper";
import { UserProgress } from "@/components/UserProgress";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function LearnPage() {
    const userProgressPromise = getUserProgress();

    const [
        userProgress,
    ] = await Promise.all([
            userProgressPromise
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <CourseHeader title={userProgress.activeCourse.title} />
            </FeedWrapper>
        </div>
    );
}

