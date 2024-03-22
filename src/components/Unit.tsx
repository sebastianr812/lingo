import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./UnitBanner";
import { LessonButton } from "./LessonButton";

type Props = {
    id: number;
    order: number
    title: string;
    description: string
    lessons: (typeof lessons.$inferSelect & {
        completed: boolean;
    })[];
    activeLesson: typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
    } | undefined;
    activeLessonPercentage: number;
}

export const Unit = ({
    lessons, title, description, order, activeLesson, activeLessonPercentage, id
}: Props) => {
    return (
        <>
            <UnitBanner
                title={title}
                description={description}
            />
            <div className="flex items-center flex-col relative">
                {lessons.map((lesson, idx) => {
                    const isCur =lesson.id === activeLesson?.id;
                    const isLocked = !lesson.completed && !isCur;

                    return (
                        <LessonButton
                            key={lesson.id}
                            id={lesson.id}
                            index={idx}
                            totalCount={lessons.length - 1}
                            current={isCur}
                            locked={isLocked}
                            percentage={activeLessonPercentage}
                        />
                    );
                })}
            </div>
        </>
    );
}


