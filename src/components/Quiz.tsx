"use client";

import Confetti from "react-confetti";
import Image from "next/image";
import { LessonHeader } from "./LessonHeader";
import { QuestionBubble } from "./QuestionBubble";
import { Challenge } from "./Challenge";
import { ChallengeFooter } from "./ChallengeFooter";
import { ResultCard } from "./ResultCard";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useState, useTransition } from "react";
import { upsertChallengeProgress } from "@/actions/challengeProgress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/userProgress";
import { useAudio, useWindowSize, useMount } from "react-use";
import { useRouter } from "next/navigation";
import { useHeartModal } from "@/store/useHeartsModal";
import { usePracticeModal } from "@/store/usePracticeModal";

type Props = {
    initalLessonId: number;
    initalPercentage: number;
    initalHearts: number;
    initalLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: typeof userSubscription.$inferSelect & {
        isActive: boolean;
    } | null;
}

export const Quiz = ({
    initalPercentage,
    initalHearts,
    userSubscription,
    initalLessonChallenges,
    initalLessonId }: Props
) => {

    const { open: openHeartsModal } = useHeartModal();
    const { open: openPracticeModal } = usePracticeModal();

    useMount(() => {
        // Lesson is completed, user is practicing
        if (initalPercentage === 100){
            openPracticeModal();
        }
    });

    const { width, height } = useWindowSize();

    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
    const [
        correctAudio,
        _c,
        correctControls
    ] = useAudio({ src: "/correct.wav" });

    const [
        incorrectAudio,
        _i,
        incorrectControls
    ] = useAudio({ src: "/incorrect.wav" });

    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const [lessonId] = useState(initalLessonId);
    const [hearts, setHearts] = useState(initalHearts);
    const [percentage, setPercentage] = useState(() => {
        return initalPercentage === 100 ? 0: initalPercentage;
    });
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

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

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
                            openHeartsModal();
                            return;
                        }
                        correctControls.play();
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
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((res) => {
                        if (res?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }
                        incorrectControls.play();
                        setStatus("wrong");
                        if (!res?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Please try again"));
            });
        }

    }

    if (!challenge) {
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gapy-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src="/finish.svg"
                        alt="Finished"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image
                        src="/finish.svg"
                        alt="Finished"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job! <br /> You&apos;ve completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            lessonId={lessonId}
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            lessonId={lessonId}
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <ChallengeFooter
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        );
    }

    const title = challenge.type === "ASSIST" ?
        "Select the correct meaning" :
        challenge.question;

    return (
        <>
            {correctAudio}
            {incorrectAudio}
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
                                disabled={pending}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ChallengeFooter
                disabled={!selectedOption || pending}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};

