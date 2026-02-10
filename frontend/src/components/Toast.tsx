import { Check, X } from "lucide-react"

export type toastType = "SUCCESS" | "ERROR"

export interface toastProps {
    toastType: toastType,
    text: string
}

export function Toast({toastType, text}: toastProps) {
    return (
        <>
        {toastType == "SUCCESS"? (
            <div className="success-toast toast">
                <Check size={20}/>
                <span>{text}</span>
            </div>
        ) : (
            <div className="error-toast toast">
                <X size={20}/>
                <span>{text}</span>
            </div>
        )}
        </>
    )
}