import { useEffect, useRef, useState } from "react"
import { LogEntry, logger } from "../lib/logger";
import { SaveLogs } from "../../wailsjs/go/main/App";
import { toaster } from "../lib/toaster";
import { Download } from "lucide-react";

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

    const onDownload = () => {
        SaveLogs(logger.exportAsText());
        toaster.addToast("SUCCESS", "Downloaded log successfully.", 3000);
    }

    return (
        <div className="container no-top-margin flex-col justify-start">
            <div className="flex-row justify-between">
                <h1 className="page-header">Debug</h1>
                <button className="accent check-btn" onClick={onDownload}>
                    <Download size={20}/>
                    <span>Download</span>
                </button>
            </div>
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