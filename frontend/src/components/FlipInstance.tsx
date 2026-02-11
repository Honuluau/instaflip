import { EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";

interface FlipInstanceProps {
    id: number;
    date: number;
    deleteFlip: Function;
}

export function FlipInstance({ id, date, deleteFlip }: FlipInstanceProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const deleteInstance = () => {
        console.log(`DELETE ${id} AT ${date}`);
        setShowDropdown(false);
        deleteFlip(id, date)
    }

    return (
        <div className='flip-instance'>
            <div className='selection'>
                <span className='id'>{id}</span>
            </div>
            <div className='information'>
                <span className='date'>{new Date(date).toLocaleString('en-us', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</span>
            </div>
            <div className='action'>
                <button onClick={handleDropdown}><EllipsisVertical size={16} /></button>
                {showDropdown && (
                    <>
                        <div className="dropdown">
                            <button className="delete-btn" onClick={deleteInstance}>
                                <Trash size={20}/>
                                <span>Delete</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}