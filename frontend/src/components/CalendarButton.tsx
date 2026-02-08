interface Props {
    text: String,
    dateString?: String,
    setDateFunction?: Function,
    isCurrentMonth?: boolean,
    isSelected?: boolean
}

export function CalendarButton({text, dateString, setDateFunction, isCurrentMonth, isSelected}: Props) {
    const gray = `${isCurrentMonth? '' : 'gray'}${isSelected? 'selected' : ''}`;

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