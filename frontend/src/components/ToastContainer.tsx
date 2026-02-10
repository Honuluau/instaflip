import { useEffect, useState } from "react";
import { Toast } from "./Toast";
import { toast, toaster } from "../lib/toaster";

export function ToastContainer() {
    const [toasts, setToasts] = useState<toast[]>([]);

    useEffect(() => {
        const unsubscribe = toaster.subscribe(() => {
            setToasts(toaster.getToasts());
        })

        setToasts(toaster.getToasts());
        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <div className="toast-container">
            <div className="toaster">
                {toasts.map((toast, i) => (
                    <Toast key={i} text={toast.text} toastType={toast.toastType}/>
                ))}
            </div>
        </div>
    )
}