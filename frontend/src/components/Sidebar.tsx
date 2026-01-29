import { BugOff, CalendarCog, ChartArea, ChartNoAxesColumn, ChartNoAxesCombined, Github, HomeIcon, Info, Settings } from "lucide-react";
import { openExternalURL } from "../lib/utils";

export type PageType = "main" | "settings" | "statistics" | "debug" | "info"

interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
}

const iconSize = 20;

export function Sidebar({ currentPage, onPageChange}: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="section">
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
            </div>

            <div className="section bottom">
                {/*Info*/}
                <button
                    onClick={() => onPageChange("info")}
                >
                    <Info size={iconSize}/>
                </button>

                {/*Github*/}
                <button
                onClick={() => openExternalURL("https://github.com/Honuluau/instaflip")}
                >
                    <Github size={iconSize}/>
                </button>
            </div>
            <div className="sidebar-line" />
        </div>
    )
}