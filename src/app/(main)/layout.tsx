import { MobileHeader } from "@/components/MobileHeader"
import { Sidebar } from "@/components/sidebar"

type Props = {
    children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    return (
        <>
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="lg:pl-[256px] pt-[50px] lg:pt-0 h-full">
                <div className="bg-rose-500 h-full">
                    {children}
                </div>
            </main>
        </>
    )
}


