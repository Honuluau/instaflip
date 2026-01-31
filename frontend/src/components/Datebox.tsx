import { CalendarFold } from "lucide-react";
import { useEffect, useState } from "react";

interface DateboxProps {
    date: string,
}

export function Datebox({ date }: DateboxProps) {
    const [open, setOpen] = useState<Boolean>();

    const handleButton = () => {
        setOpen(true);
        console.log("Set Open to:", open);
    }

    return (
        <>
            <button className="date-box" onClick={handleButton}>
                <span>{date}</span>
                <CalendarFold size={20} strokeWidth={2} />
            </button>
            {open && (
                <div><h1>TEST</h1></div>
            )}
        </>
    )
}