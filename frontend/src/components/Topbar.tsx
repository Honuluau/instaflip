import { Maximize, Minus, X } from "lucide-react";
import { WindowMinimise, WindowToggleMaximise, Quit} from "../../wailsjs/runtime/runtime"
import { SaveLogs } from "../../wailsjs/go/main/App";
import { logger } from "../lib/logger";


const iconSize = 16;

export function Topbar() {
    const minimise = () => {
        WindowMinimise();
    }

    const toggleMaximise = () => {
        WindowToggleMaximise();
    }

    const quit = async () => {
        logger.info("Closing InstaFlip.")
        const success = await SaveLogs(logger.exportAsText());
        setTimeout(() => {Quit()}, 100);
    }

    return (
        <div className="topbar">
            <div>
                {/*Minimize*/}
                <button
                onClick={minimise}
                >
                    <Minus size={iconSize}/>
                </button>

                {/*Expand*/}
                <button
                onClick={toggleMaximise}
                >
                    <Maximize size={iconSize}/>
                </button>

                {/*Close*/}
                <button
                onClick={quit}
                >
                    <X size={iconSize}/>
                </button>
            </div>
        </div>
    )
}