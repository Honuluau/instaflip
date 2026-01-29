import { Check, OctagonAlert } from "lucide-react";

interface CanFlipProps {
    flips: number
}

export function MaximumFlipsReachedBanner() {
    return (
        <div className='container'>
            <div className='banner ineligible'>
                <OctagonAlert size={20} />
                <span>This patron has reached the maximum amount of flips for the semester.</span>
            </div>
        </div>
    )
}

export function CanFlipBanner({flips}: CanFlipProps) {
    return (
        <div className='container'>
            <div className='banner eligible'>
                <Check size={20} />
                <span>This patron has {String(flips)} available flips.</span>
            </div>
        </div>
    )
}