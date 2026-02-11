export type LogLevel = "info" | "success" | "error" | "debug";

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
}

class Logger {
    private logs: LogEntry[] = [];
    private maxLogs = 250;
    private listeners: Set<() => void> = new Set();

    private addLog(level: LogLevel, message: string) {
        const entry: LogEntry = {
            timestamp: new Date(),
            level,
            message
        };

        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        this.notifyListeners();
    }

    info(message: string) {
        this.addLog('info', message);
    }

    success(message: string) {
        this.addLog('success', message);
    }

    error(message: string) {
        this.addLog('error', message);
    }

    debug(message: string) {
        this.addLog('debug', message);
    }

    getLogs(): LogEntry[] {
        return [... this.logs];
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener())
    }

    exportAsText(): string {
        return this.logs.map(
            (l) =>
                `[${l.timestamp.toISOString()}] [${l.level}] ${l.message}`
        ).join("\n");
    }
}

export const logger = new Logger();