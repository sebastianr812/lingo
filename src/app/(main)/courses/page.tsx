import { List } from "@/components/List";
import { getCourses, getUserProgress } from "@/db/queries";

export default async function CoursesPage() {
    // blocks rendering for each request -> requests are consecutive
    // const courses = await getCourses();
    // const userProgress = await getUserProgress();
    // NEXTJS: best practice -> use promise.all to make requests/resolve promises in parallel
    const coursePromise = getCourses();
    const userProgressPromise = getUserProgress();
    const [
        courses,
        userProgress
    ] = await Promise.all([
        coursePromise,
        userProgressPromise
    ]);

    return (
        <div className="h-full max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Language Courses
            </h1>
            <List
                courses={courses}
                activeCourseId={userProgress?.activeCourseId}
            />
        </div>
    );
}

