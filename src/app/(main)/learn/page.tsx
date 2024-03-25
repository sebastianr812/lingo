import { CourseHeader } from "@/components/CourseHeader";
import { FeedWrapper } from "@/components/FeedWrapper";
import { StickyWrapper } from "@/components/StickyWrapper";
import { Unit } from "@/components/Unit";
import { UserProgress } from "@/components/UserProgress";
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function LearnPage() {
    const userProgressPromise = getUserProgress();
    const unitsPromise = getUnits();
    const courseProgressPromise = getCourseProgress();
    const lessonPercentagePromise = getLessonPercentage();

    const [
        userProgress,
        units,
        courseProgress,
        lessonPercentage,
    ] = await Promise.all([
            userProgressPromise,
            unitsPromise,
            courseProgressPromise,
            lessonPercentagePromise,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    if (!courseProgress) {
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
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={courseProgress.activeLesson}
                            activeLessonPercentage={lessonPercentage}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
}

