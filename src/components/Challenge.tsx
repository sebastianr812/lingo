import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { ChallengeCard } from "./ChallengeCard";

type Props ={
    options: typeof challengeOptions.$inferSelect[];
    onSelect: (id :number) => void;
    status: "correct" | "wrong" | "none";
    selectedOption?: number;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
};

export const Challenge = ({
    type, status, options, onSelect, disabled, selectedOption
}: Props) => {
    return (
        <div className={cn(
            "grid gap-2",
            type === "ASSIST" && "grid-cols-1",
            type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
        )}>
            {options.map((opt, idx) => (
                <ChallengeCard
                    key={opt.id}
                    id={opt.id}
                    text={opt.text}
                    imageSrc={opt.imageSrc}
                    shortcut={`${idx + 1}`}
                    selected={selectedOption === opt.id}
                    onClick={() => onSelect(opt.id)}
                    status={status}
                    audioSrc={opt.audioSrc}
                    disabled={disabled}
                    type={type}
                />
            ))}
        </div>
    );
}

