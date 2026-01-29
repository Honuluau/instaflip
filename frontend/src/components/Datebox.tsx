import { CalendarFold } from "lucide-react";

interface DateboxProps {
    date: string
}

export function Datebox({date}: DateboxProps) {
    return (
        <button className="date-box">
            <span>{date}</span>
            <CalendarFold size={20} strokeWidth={2} />
        </button>
    )
}