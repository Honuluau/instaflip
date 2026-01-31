import { useEffect, useRef, useState } from "react"
import { LogEntry, logger } from "../lib/logger";

function formatTime(date: Date): string {
    return date.toLocaleDateString("en-us", {
        hour12: false,
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
}

export function DebugPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = logger.subscribe(() => {
            setLogs(logger.getLogs());
        })

        setLogs(logger.getLogs());
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="container no-top-margin flex-col justify-start">
            <h1 className="page-header">Debug</h1>
            <div ref={scrollRef} className="debug-log">
                {logs.length === 0 ? (
                    <p>No logs.</p>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="log-entry">
                            <span className="c1">[{formatTime(log.timestamp)}]</span>
                            <span className={`c2 ${log.level}`}>[{log.level}]</span>
                            <span className="c3">{log.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}