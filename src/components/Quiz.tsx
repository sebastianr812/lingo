"use client";

import { challengeOptions, challenges } from "@/db/schema";
import { useState, useTransition } from "react";
import { LessonHeader } from "./LessonHeader";
import { QuestionBubble } from "./QuestionBubble";
import { Challenge } from "./Challenge";
import { ChallengeFooter } from "./ChallengeFooter";
import { upsertChallengeProgress } from "@/actions/challengeProgress";
import { toast } from "sonner";

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
    const [pending, startTransition] = useTransition();

    const [hearts, setHearts] = useState(initalHearts);
    const [percentage, setPercentage] = useState(initalPercentage);
    const [challenges] = useState(initalLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((chal) => !chal.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"none" | "correct" | "wrong">("none");

    const onSelect = (id: number) => {
        if (status !== "none") {
            return;
        }
        setSelectedOption(id);
    };

    const challenge = challenges[activeIndex]
    const options = challenge.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((cur) => cur + 1);
    }

    const onContinue = () => {
        if (!selectedOption) {
            return;
        }

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((opt) => opt.correct);
        if (!correctOption) {
            return;
        }

        if (correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((res) => {
                        if (res?.error === "hearts") {
                            console.error("missing hearts");
                            return;
                        }
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        // This is a practice
                        if (initalPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Please try again"));
            });
        } else {
            console.error("incorrect option!");
        }

    }

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
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={false}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ChallengeFooter
                disabled={!selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};

