import { CourseHeader } from "@/components/CourseHeader";
import { FeedWrapper } from "@/components/FeedWrapper";
import { StickyWrapper } from "@/components/StickyWrapper";
import { UserProgress } from "@/components/UserProgress";

export default function LearnPage() {
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={{ title: "Spanish", imageSrc: "es.svg"}}
                    hearts={5}
                    points={100}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <CourseHeader title="Spanish"/>
            </FeedWrapper>
        </div>
    );
}

