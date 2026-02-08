interface Props {
    text: String,
    dateString?: String,
    setDateFunction?: Function,
    isCurrentMonth?: boolean
}

export function CalendarButton({text, dateString, setDateFunction, isCurrentMonth}: Props) {
    const gray = `${isCurrentMonth? '' : 'gray'}`;

    const onClickHandle = () => {
        if (!setDateFunction) return;

        setDateFunction(dateString);
    }

    return (
        <div className='calendar-button'>
            <button className={gray} onClick={onClickHandle}>{text}</button>
        </div>
    )
}