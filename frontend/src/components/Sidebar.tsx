import { BugOff, CalendarCog, ChartArea, ChartNoAxesColumn, ChartNoAxesCombined, HomeIcon, Settings } from "lucide-react";

export type PageType = "main" | "settings" | "debug" | "database"

interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
}

const iconSize = 20;

export function Sidebar({ currentPage, onPageChange}: SidebarProps) {
    return (
        <div className="flex-col sidebar">
            {/*Home Button*/}
            <button>
                <HomeIcon size={iconSize}/>
            </button>

            {/*Settings*/}
            <button>
                <CalendarCog size={iconSize}/>
            </button>

            {/*Statistics*/}
            <button>
                <ChartNoAxesCombined size={iconSize}/>
            </button>

            {/*Debug Logs*/}
            <button>
                <BugOff size={iconSize}/>
            </button>
            <div className="sidebar-line" />
        </div>
    )
}