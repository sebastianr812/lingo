import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ExitModal } from "@/components/modals/ExitModal";
import { HeartsModal } from "@/components/modals/HeartsModal";
import { PracticeModal } from "@/components/modals/PracticeModal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Lingo | Learn Languages Interactively",
    description: "Lingo is a learning platform where users can learn new languages in a fun, interactive way!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={font.className}>
                    <Toaster />
                    <ExitModal />
                    <HeartsModal />
                    <PracticeModal />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
