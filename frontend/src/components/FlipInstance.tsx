import { EllipsisVertical } from "lucide-react";

interface FlipInstanceProps {
    id: number;
    date: number;
}

export function FlipInstance({id, date}: FlipInstanceProps) {
    return (
        <div className='flip-instance'>
            <div className='selection'>
                <span className='id'>{id}</span>
            </div>
            <div className='information'>
                <span className='date'>{new Date(date).toLocaleString('en-us', {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})}</span>
            </div>
            <div className='action'>
                <button><EllipsisVertical size={16}/></button>
            </div>
        </div>
    )
}