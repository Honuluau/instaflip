import { Expand, Minus, X } from "lucide-react";

const iconSize = 16;

export function Topbar() {
    return (
        <div className="topbar">
            <div className="flex">
                {/*Minimize*/}
                <button>
                    <Minus size={iconSize}/>
                </button>

                {/*Expand*/}
                <button>
                    <Expand size={iconSize}/>
                </button>

                {/*Close*/}
                <button>
                    <X size={iconSize}/>
                </button>
            </div>
        </div>
    )
}