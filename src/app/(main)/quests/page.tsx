import { FeedWrapper } from "@/components/FeedWrapper";
import { StickyWrapper } from "@/components/StickyWrapper";
import { UserProgress } from "@/components/UserProgress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

const quests = [
    {
        title: "Earn 20 XP",
        value: 20,
    },
    {
        title: "Earn 50 XP",
        value: 50,
    },
    {
        title: "Earn 100 XP",
        value: 100,
    },
    {
        title: "Earn 500 XP",
        value: 500,
    },
    {
        title: "Earn 1000 XP",
        value: 1000,
    },
];

export default async function QuestsPage() {

    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();

    const [
        userProgress,
        userSubscription,
    ] = await Promise.all([
        userProgressPromise,
        userSubscriptionPromise,
    ]);

    const isPro = !!userSubscription?.isActive;

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
                    hasActiveSubscription={isPro}
                />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/quests.svg"
                        alt="Quests"
                        height={90}
                        width={90}
                    />
                    <h1 className="text-center font-bold text-enutral-800 text-2xl my-6">
                        Quests
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Complete quests by earning points.
                    </p>
                    <ul className="w-full">
                        {quests.map((quest) => (

                        ))}
                    </ul>
                </div>
            </FeedWrapper>
        </div>
    );
}

