interface Props {
    text: String,
}

export function CalendarButton({text}: Props) {
    return (
        <div className="calendar-button">
            <p>{text}</p>
        </div>
    )
}