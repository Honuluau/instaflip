import { EllipsisVertical } from "lucide-react";

interface FlipInstanceProps {
    id: number;
    date: string;
}

export function FlipInstance({id, date}: FlipInstanceProps) {
    return (
        <div className='flip-instance'>
            <div className='selection'>
                <span className='id'>{id}</span>
            </div>
            <div className='information'>
                <span className='date'>{date}</span>
            </div>
            <div className='action'>
                <button><EllipsisVertical size={16}/></button>
            </div>
        </div>
    )
}