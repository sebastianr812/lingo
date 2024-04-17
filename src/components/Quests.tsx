import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
    points: number;
}

// TODO: FINISH

export const Quests = ({ points }: Props) => {
    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between w-full space-y-2">
                <h3 className="font-bold text-lg">
                    Quests
                </h3>
                <Link href="/quests">
                    <Button
                        size="sm"
                        variant="primaryOutline"
                    >
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    );
}

