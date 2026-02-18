import { CalendarFold } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";

interface DateboxProps {
    date: Date,
    update: Function
}

export function Datebox({ date, update }: DateboxProps) {
    const [open, setOpen] = useState<Boolean>();
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleSelectDate = (dateString: string) => {
        const date = new Date(dateString);

        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        setSelectedDate(date);
        update(date.getTime())
    }

    useEffect(() => {
        if (!selectedDate) {
            setSelectedDate(date);
        } else {
            setSelectedDate(selectedDate);
        }
    }, [selectedDate])

    return (
        <>
            <button className="date-box" onClick={() => setOpen(!open)}>
                <span>{selectedDate?.toLocaleString('en-us', {'month': 'short', day: 'numeric', year: 'numeric'})}</span>
                <CalendarFold size={20} strokeWidth={2} />
            </button>
            {open && (
                <Calendar SelectedDate={selectedDate? selectedDate : new Date(date)} Cancel={() => setOpen(false)} SetDateFunction={handleSelectDate}/>
            )}
        </>
    )
}