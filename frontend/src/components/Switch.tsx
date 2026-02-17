import { ChangeEventHandler } from "react"

interface switchProps {
    onChange: ChangeEventHandler
}

export function Switch({onChange}: switchProps) {
    return (
        <>
            <label className="switch">
                <input type="checkbox" onChange={onChange}/>
                <span className="slider" />
            </label>
        </>
    )
}