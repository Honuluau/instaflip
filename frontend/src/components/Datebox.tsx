import { CalendarFold } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";

interface DateboxProps {
    date: string,
}

export function Datebox({ date }: DateboxProps) {
    const [open, setOpen] = useState<Boolean>();

    return (
        <>
            <button className="date-box" onClick={() => setOpen(true)}>
                <span>{date}</span>
                <CalendarFold size={20} strokeWidth={2} />
            </button>
            {open && (
                <Calendar SelectedDate={Date.now()} Cancel={() => setOpen(false)}/>
            )}
        </>
    )
}