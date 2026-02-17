import { ChangeEventHandler } from "react"

interface switchProps {
    onChange: ChangeEventHandler,
    checked: boolean,
}

export function Switch({onChange, checked}: switchProps) {
    return (
        <>
            <label className="switch">
                <input type="checkbox" onChange={onChange} checked={checked}/>
                <span className="slider" />
            </label>
        </>
    )
}