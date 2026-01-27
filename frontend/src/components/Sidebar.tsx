import { BugOff, CalendarCog, ChartArea, ChartNoAxesColumn, ChartNoAxesCombined, HomeIcon, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <div>
            {/*Home Button*/}
            <button>
                <HomeIcon size={20}/>
            </button>

            {/*Settings*/}
            <button>
                <CalendarCog size={20}/>
            </button>

            {/*Statistics*/}
            <button>
                <ChartNoAxesCombined size={20}/>
            </button>

            {/*Debug Logs*/}
            <button>
                <BugOff size={20}/>
            </button>
        </div>
    )
}