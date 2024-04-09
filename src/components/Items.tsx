"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { refillHearts } from "@/actions/userProgress";
import { toast } from "sonner";
import { createStripeUrl } from "@/actions/userSubscription";

const POINTS_TO_REFILL = 10;

type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
}

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
    const [pending, startTransition] = useTransition();

    const onRefillHerts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }

        startTransition(() => {
            refillHearts()
                .catch(() => toast.error("Something went wrong"))
        });
    }

    const onUpgrade = () => {
        startTransition(() => {
            createStripeUrl()
                .then((res) => {
                    if (res.data) {
                        window.location.href = res.data;
                    }
                })
                .catch(() => toast.error("Something went wrong"));
        });
    }

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image
                    src="/heart.svg"
                    alt="heart"
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Refill hearts
                    </p>
                </div>
                <Button
                    onClick={onRefillHerts}
                    disabled={
                        pending ||
                        hearts === 5 ||
                        points < POINTS_TO_REFILL
                    }
                >
                    {hearts === 5 ? "full" : (
                        <div className="flex items-center">
                            <Image
                                src="/points.svg"
                                alt="points"
                                height={20}
                                width={20}
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>
                        </div>
                    )}
                </Button>
            </div>
            <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
                <Image
                    src="/unlimited.svg"
                    alt="unlimited"
                    height={60}
                    width={60}
                />

                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Unlimited hearts
                    </p>
                </div>
                <Button
                    disabled={pending || hasActiveSubscription}
                    onClick={onUpgrade}
                >
                    {hasActiveSubscription ? "active": "upgrade"}
                </Button>
            </div>
        </ul>
    );
}
