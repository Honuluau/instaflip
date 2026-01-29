import { EllipsisVertical } from "lucide-react";

export function FlipInstance() {
    return (
        <div className='flip-instance'>
            <div className='selection'>
                <input type='checkbox' />
                <span className='id'>1</span>
            </div>
            <div className='information'>
                <span className='date'>2026-01-29 11:25 AM</span>
            </div>
            <div className='action'>
                <button><EllipsisVertical size={16} /></button>
            </div>
        </div>
    )
}