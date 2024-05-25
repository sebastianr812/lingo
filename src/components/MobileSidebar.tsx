import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { MenuIcon } from "lucide-react";
import { Sidebar } from "./Sidebar_temp";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <MenuIcon className="text-white"/>
            </SheetTrigger>
            <SheetContent className="p-0 z-[100]" side="left">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}

