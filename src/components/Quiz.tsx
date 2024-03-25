"use client"

import { challengeOptions, challenges } from "@/db/schema";

type Props = {
    initalLessonId: number;
    initalPercentage: number;
    initalHearts: number;
    initalLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: null; // TODO: replace with correct db type for Stripe sub
}

export const Quiz = ({
    initalPercentage,
    initalHearts,
    userSubscription,
    initalLessonChallenges,
    initalLessonId }: Props
) => {
    return (
        <div>
            Quizzz
        </div>
    );
};

