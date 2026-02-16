import { ReactElement } from "react"

interface overlayProps {
    icon: ReactElement,
    label: string,
    text: string
}

export function Overlay({icon, label, text}: overlayProps) {
    return (
        <div className="overlay">
            <div className="overlay-box">
                <div className="overlay-row">
                    {icon}
                    <h2>{label}</h2>
                </div>
                <p>{text}</p>
            </div>
        </div>
    )
}