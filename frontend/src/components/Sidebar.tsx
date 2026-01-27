import { BugOff, CalendarCog, ChartArea, ChartNoAxesColumn, ChartNoAxesCombined, HomeIcon, Settings } from "lucide-react";

export type PageType = "main" | "settings" | "statistics" | "debug"

interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
}

const iconSize = 20;

export function Sidebar({ currentPage, onPageChange}: SidebarProps) {
    return (
        <div className="flex-col sidebar">
            {/*Home Button*/}
            <button
                onClick={() => onPageChange("main")}
            >
                <HomeIcon size={iconSize}/>
            </button>

            {/*Settings*/}
            <button
                onClick={() => onPageChange("settings")}
            >
                <CalendarCog size={iconSize}/>
            </button>

            {/*Statistics*/}
            <button
                onClick={() => onPageChange("statistics")}
            >
                <ChartNoAxesCombined size={iconSize}/>
            </button>

            {/*Debug Logs*/}
            <button
                onClick={() => onPageChange("debug")}
            >
                <BugOff size={iconSize}/>
            </button>
            <div className="sidebar-line" />
        </div>
    )
}