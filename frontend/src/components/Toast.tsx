import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toastType } from "../lib/toaster"

export interface toastProps {
    toastType: toastType,
    text: string,
    duration: number
}

export function Toast({toastType, text, duration}: toastProps) {
    const [showToast, setShowToast] = useState<boolean>(false);

    const triggerToast = () => {
        setShowToast(true)
        console.log(`Duration of ${duration}ms`)
        setTimeout(() => setShowToast(false), duration)
    }
    
    useEffect(() => {
        triggerToast();
    }, [])

    return (
        <>
        {toastType == "SUCCESS"? (
            <div className={`success-toast toast ${showToast ? "show" : ""}`}>
                <Check size={20}/>
                <span>{text}</span>
            </div>
        ) : (
            <div className={`error-toast toast ${showToast ? "show" : ""}`}>
                <X size={20}/>
                <span>{text}</span>
            </div>
        )}
        </>
    )
}