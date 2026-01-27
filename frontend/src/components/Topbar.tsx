import { Maximize, Minus, X } from "lucide-react";
import { WindowMinimise, WindowToggleMaximise, Quit} from "../../wailsjs/runtime/runtime"


const iconSize = 16;

export function Topbar() {
    const minimise = () => {
        WindowMinimise();
    }

    const toggleMaximise = () => {
        WindowToggleMaximise();
    }

    const quit = () => {
        Quit();
    }

    return (
        <div className="topbar">
            <div className="flex">
                {/*Minimize*/}
                <button
                onClick={() => minimise}
                >
                    <Minus size={iconSize}/>
                </button>

                {/*Expand*/}
                <button>
                    <Maximize size={iconSize}/>
                </button>

                {/*Close*/}
                <button>
                    <X size={iconSize}/>
                </button>
            </div>
        </div>
    )
}