import { Toast } from "./Toast";

export function ToastContainer() {
    return (
        <div className="toast-container">
            <div className="toaster">
                <Toast toastType="SUCCESS" text={"Successfully Exported"}/>
                <Toast toastType="ERROR" text={"Failed export."}/>
            </div>
        </div>
    )
}