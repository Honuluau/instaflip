import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react"
import { CalendarButton } from "./CalendarButton";

export interface CalendarProps {
    SelectedDate: Date,
    Cancel: Function,
    SetDateFunction: Function
}

interface CalendarDay {
    day: number,
    isCurrentMonth: boolean,
    dateString: string,
}

export function Calendar({ SelectedDate, Cancel, SetDateFunction }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [days, setDays] = useState<CalendarDay[]>();

    const handleSetDays = (tempDate: Date) => {
        // set days
        let year = tempDate.getFullYear();
        let month = tempDate.getMonth();

        const date = new Date(year, month, 1);
        const startDay = date.getDay() // Offset from Sunday = 0, Thursday = 4
        const totalDays = new Date(year, month + 1, 0).getDate()

        const previousMonthLastDay = new Date(year, month, 0).getDate()

        const days: CalendarDay[] = [];

        // Add previous days.
        for (let i = startDay-1; i >= 0; i--) {
            days.push({
                day: previousMonthLastDay-i,
                isCurrentMonth: false,
                dateString: new Date(year, month - 1, previousMonthLastDay-i).toISOString().split('T')[0]
            })
        }

        // Add actual days
        for (let d = 1; d <= totalDays; d++) {
            days.push({
                day: d,
                isCurrentMonth: true,
                dateString: new Date(year, month, d).toISOString().split('T')[0]
            })
        }

        // Add after days.
        const lastDayMonth = new Date(year, month+1, 0).getDay();

        for (let e = 1; e < 7-lastDayMonth; e++) {
            days.push({
                day: e,
                isCurrentMonth: false,
                dateString: new Date(year, month+1, e).toISOString().split('T')[0]
            })
        }

        setDays(days)
    }

    const incrementDateByMonth = (negativeMultiplier: number) => {
        if (!selectedDate) return;

        let tempDate = new Date(selectedDate);
        tempDate.setHours(12);
        tempDate.setDate(1);
        tempDate.setMonth(selectedDate.getMonth() + 1 * negativeMultiplier)
        setSelectedDate(tempDate);

        handleSetDays(tempDate);
    }

    const handleSetDate = (dateString: string) => {
        SetDateFunction(dateString);
        Cancel();
    }

    useEffect(() => {
        setSelectedDate(new Date(SelectedDate));
        handleSetDays(new Date(SelectedDate));
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
                    <CalendarButton text="SUN" />
                    <CalendarButton text="MON"/>
                    <CalendarButton text="TUE"/>
                    <CalendarButton text="WED"/>
                    <CalendarButton text="THU"/>
                    <CalendarButton text="FRI"/>
                    <CalendarButton text="SAT"/>
                </div>
                <div className="calendar-buttons">
                    {days?.map((day: CalendarDay, d) => (
                        <CalendarButton key={d} text={day.day.toString()} dateString={day.dateString} isCurrentMonth={day.isCurrentMonth} setDateFunction={handleSetDate}/>
                    ))
                    }
                </div>
            </div>

            {/*Footer*/}
            <div className="footer">
                <button onClick={() => Cancel()}>Cancel</button>
            </div>
        </div>
    )
}