import { Check, OctagonAlert } from "lucide-react";

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

export function CanFlipBanner() {
    return (
        <div className='container'>
            <div className='banner eligible'>
                <Check size={20} />
                <span>This patron has 2 available flips.</span>
            </div>
        </div>
    )
}