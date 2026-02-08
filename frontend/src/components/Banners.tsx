import { Check, OctagonAlert } from "lucide-react";

interface maxFlipsProps {
    patron: string,
}

interface CanFlipProps {
    patron: string
    flips: number
}

export function MaximumFlipsReachedBanner({patron}: maxFlipsProps) {
    return (
        <div className='container'>
            <div className='banner ineligible'>
                <OctagonAlert size={20} />
                <span>This patron ({patron}) has reached the maximum amount of flips for the semester.</span>
            </div>
        </div>
    )
}

export function CanFlipBanner({patron, flips}: CanFlipProps) {
    return (
        <div className='container'>
            <div className='banner eligible'>
                <Check size={20} />
                <span>This patron ({patron}) has {String(flips)} available flips.</span>
            </div>
        </div>
    )
}