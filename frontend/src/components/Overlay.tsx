interface overlayProps {
    label: string,
    text: string
}

export function Overlay({label, text}: overlayProps) {
    return (
        <div className="overlay">
            <div className="overlay-box">
                <h2>// WARNING</h2>
                <h3>{label}</h3>
                <p>{text}</p>
            </div>
        </div>
    )
}