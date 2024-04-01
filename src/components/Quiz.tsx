"use client";

import { challengeOptions, challenges } from "@/db/schema";
import { useState } from "react";
import { LessonHeader } from "./LessonHeader";
import { QuestionBubble } from "./QuestionBubble";
import { Challenge } from "./Challenge";

type Props = {
    initalLessonId: number;
    initalPercentage: number;
    initalHearts: number;
    initalLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any; // TODO: replace with correct db type for Stripe sub
}

export const Quiz = ({
    initalPercentage,
    initalHearts,
    userSubscription,
    initalLessonChallenges,
    initalLessonId }: Props
) => {

    const [hearts, setHearts] = useState(initalHearts);
    const [percentage, setPercentage] = useState(initalPercentage);
    const [challenges] = useState(initalLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((chal) => !chal.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex
    });

    const challenge = challenges[activeIndex]
    const options = challenge.challengeOptions ?? [];

    const title = challenge.type === "ASSIST" ?
        "Select the correct meaning" :
        challenge.question;

    return (
        <>
            <LessonHeader
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}
                            <Challenge
                                options={options}
                                onSelect={() => {}}
                                status="none"
                                selectedOption={undefined}
                                disabled={false}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

