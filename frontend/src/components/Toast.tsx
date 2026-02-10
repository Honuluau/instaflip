import { Check, X } from "lucide-react"
import { useEffect } from "react"
import { toastType } from "../lib/toaster"

export interface toastProps {
    toastType: toastType,
    text: string,
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