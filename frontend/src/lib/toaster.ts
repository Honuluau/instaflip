export type toastType = "SUCCESS" | "ERROR"

export interface toast {
    id: string;
    toastType: toastType;
    text: string;
    duration: number;
}

class Toaster {
    private toasts: toast[] = [];
    private listeners: Set<() => void> = new Set();

    addToast(toastType: toastType, text: string, duration: number) {
        const id = Math.random().toString(36).substring(3, 10);
        const toast: toast = {
            id: id,
            toastType: toastType,
            text: text,
            duration: duration
        }

        this.toasts.push(toast);
        this.notifiyListeners();

        setTimeout(() => {
            this.removeToast(id)
        }, duration)
    }

    removeToast(id: string) {
        this.toasts = this.toasts.filter(t => t.id !== id);
        this.notifiyListeners()
    }

    getToasts(): toast[] {
        return [... this.toasts];
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifiyListeners() {
        this.listeners.forEach((listener) => listener())
    }
}

export const toaster = new Toaster();