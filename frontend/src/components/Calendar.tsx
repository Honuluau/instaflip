import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react"
import { CalendarButton } from "./CalendarButton";

export interface CalendarProps {
    SelectedDate: number,
    Cancel: Function
}

interface CalendarDay {
    day: number | null,
    dateString?: string
}

export function Calendar({ SelectedDate, Cancel }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();

    const incrementDateByMonth = (negativeMultiplier: number) => {
        if (!selectedDate) return;

        let tempDate = new Date(selectedDate);
        tempDate.setMonth(selectedDate.getMonth() + 1 * negativeMultiplier)
        setSelectedDate(tempDate)
    }

    const getDaysInMonth = (year: number, month: number): CalendarDay[] => {
        const date = new Date(year, month, 1);
        const startDay = date.getDay() // Offset from Sunday = 0, Thursday = 4
        const totalDays = new Date(year, month + 1, 0).getDate()

        const previousMonthLastDay = new Date(year, month, 0).getDate()

        const days: CalendarDay[] = [];

        // Add previous days.
        for (let i = startDay-1; i >= 0; i--) {
            days.push({
                day: previousMonthLastDay-i,
                dateString: new Date(year, month - 1, previousMonthLastDay-i).toISOString().split('T')[0]
            })
        }

        // Add actual days
        for (let d = 1; d <= totalDays; d++) {
            days.push({
                day: d,
                dateString: new Date(year, month, d).toISOString().split('T')[0]
            })
        }

        // Add after days.
        const lastDayMonth = new Date(year, month+1, 0).getDay();
        console.log(`Last Day: ${lastDayMonth}`)

        for (let e = 1; e < 7-lastDayMonth; e++) {
            days.push({
                day: e,
                dateString: new Date(year, month+1, e).toISOString().split('T')[0]
            })
        }

        return days
    }

    useEffect(() => {
        setSelectedDate(new Date(SelectedDate));
        console.log(getDaysInMonth(2026, 4))
    }, [SelectedDate])

    return (
        <div className="calendar">
            {/*Header*/}
            <div className="c-topbar">
                <div>
                    <button
                        className="primary"
                    >
                        {selectedDate?.toLocaleString('en-us', {
                            month: 'short',
                            year: 'numeric'
                        })}
                        <div className="iconContainer">
                            <ChevronRight size={14} />
                        </div>
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => incrementDateByMonth(-1)}
                    >
                        <div className="iconContainer">
                            <ChevronLeft size={14} />
                        </div>
                    </button>
                    <button
                        onClick={() => incrementDateByMonth(1)}
                    >
                        <div className="iconContainer">
                            <ChevronRight size={14} />
                        </div>
                    </button>
                </div>
            </div>

            {/*Body*/}
            <div>
                <div className="calendar-week-row gray">
                    <CalendarButton text="SUN"/>
                    <CalendarButton text="MON"/>
                    <CalendarButton text="TUE"/>
                    <CalendarButton text="WED"/>
                    <CalendarButton text="THU"/>
                    <CalendarButton text="FRI"/>
                    <CalendarButton text="SAT"/>
                </div>
                <div className="calendar-buttons">
                    {

                    }
                </div>
            </div>

            {/*Footer*/}
            <div className="footer">
                <button onClick={() => Cancel()}>Cancel</button>
                <button>Set</button>
            </div>
        </div>
    )
}