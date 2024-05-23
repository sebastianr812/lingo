import { MobileHeader } from "@/components/MobileHeader"
import { Sidebar } from "@/components/Sidebar"

type Props = {
    children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    return (
        <>
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="lg:pl-[256px] pt-[50px] lg:pt-0 h-full">
                <div className="max-w-[1056px] mx-auto pt-6 h-full">
                    {children}
                </div>
            </main>
        </>
    )
}


