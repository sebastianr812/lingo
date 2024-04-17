import { FeedWrapper } from "@/components/FeedWrapper";
import { Promo } from "@/components/Promo";
import { StickyWrapper } from "@/components/StickyWrapper";
import { UserProgress } from "@/components/UserProgress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {

    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();
    const leaderboardPromise = getTopTenUsers();

    const [
        userProgress,
        userSubscription,
        leaderboard
    ] = await Promise.all([
        userProgressPromise,
        userSubscriptionPromise,
        leaderboardPromise,
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
                {!isPro && (
                    <Promo />
                )}
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/leaderboard.svg"
                        alt="Leaderboard"
                        height={90}
                        width={90}
                    />
                    <h1 className="text-center font-bold text-enutral-800 text-2xl my-6">
                        Leaderboard
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        See where you stand among other learners in the community.
                    </p>
                    <Separator className="mb-4 h-0.5 rounded-full"/>
                    { leaderboard.map((userProgress, idx) => (
                        <div
                            key={userProgress.userId}
                            className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
                        >
                            <p className="font-bold text-lime-700 mr-4">{idx + 1}</p>
                            <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                                <AvatarImage
                                    className="object-cover"
                                    src={userProgress.userImageSrc}
                                />
                            </Avatar>
                            <p className="font-bold text-neutral-800 flex-1">
                                {userProgress.userName}
                            </p>
                            <p className="text-muted-foreground">
                                {userProgress.points} XP
                            </p>
                        </div>
                    ))}
                </div>
            </FeedWrapper>
        </div>
    );
}

