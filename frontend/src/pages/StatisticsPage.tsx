import { useEffect, useState } from "react";
import { Datebox } from "../components/Datebox";
import { getSettings, Settings as SettingsType } from "../lib/settings";
import { Ban, Bell, Download, Repeat, Sheet } from "lucide-react";
import { ExportStatistics } from "../../wailsjs/go/main/App";
import { logger } from "../lib/logger";
import { toaster } from "../lib/toaster";
import { Switch } from "../components/Switch";
import { Dropdown } from "../components/Dropdown";

export const EXPORT_STYLES = [
    "Unix Milliseconds",
    "Datetime",
    "Year, Month, & Timestamp"
]

export type ExportStyle = (typeof EXPORT_STYLES)[number];

export function StatisticsPage() {
    const [savedSettings, setSavedSettings] = useState<SettingsType>(getSettings());

    const [exportStart, setExportStart] = useState<number>(savedSettings.semesterStart);
    const [exportEnd, setExportEnd] = useState<number>(savedSettings.semesterEnd);
    const [exportFlips, setExportFlips] = useState<boolean>(true);
    const [exportDeclines, setExportDeclines] = useState<boolean>(false);
    const [exportStyle, setExportStyle] = useState<ExportStyle>("Unix Milliseconds");

    const handleExportStart = (epochNum: number) => {
        setExportStart(epochNum)
    }

    const handleExportEnd = (epochNum: number) => {
        setExportEnd(epochNum)
    }

    const getTables = () => {
        let tables = [];

        if (exportFlips) {
            tables.push("flips")
        }

        if (exportDeclines) {
            tables.push("declines")
        }

        return tables
    }

    const onExport = async (fileType: string) => {
        const exported = await ExportStatistics(exportStart, exportEnd, savedSettings.statisticsOutputPath, exportStyle, fileType, getTables());
        
        if (exported) {
            logger.success(`Exported Data from ${exportStart} -> ${exportEnd} to "${savedSettings.statisticsOutputPath}"`)
            toaster.addToast("SUCCESS", "Successfuly exported!", 3000);
        } else {
            toaster.addToast("ERROR", "Failed to download data.", 3000);
        }
    }

    const handleExportFlips = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportFlips(e.target.checked);
    }

    const handleExportDeclines = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportDeclines(e.target.checked);
    }

    return (
        <div className="container no-top-margin flex-col justify-start">
            <h1 className="page-header">Statistics</h1>
            <div className="flex-col">
                <h2>Tables</h2>
                <div className="flex-col">
                    <div className="flex-row statistic-switch">
                        <Repeat size={20} />
                        <h4>Flips</h4>
                        <Switch onChange={handleExportFlips} checked={exportFlips} />
                    </div>
                    <div className="flex-row statistic-switch">
                        <Ban />
                        <h4>Declines</h4>
                        <Switch onChange={handleExportDeclines} checked={exportDeclines} />
                    </div>
                </div>
            </div>

            <div className="flex-row">
                <div className="flex-col">
                    <h2>Export Style</h2>
                    <Dropdown options={EXPORT_STYLES} setOption={(style: string) => setExportStyle(style as ExportStyle)} />
                </div>
            </div>

            <div className="flex-col">
                <h2>Data Range</h2>
                <div className="semester-date-settings">
                    <div>
                        <h4>Export Start</h4>
                        <Datebox date={new Date(savedSettings.semesterStart)} update={handleExportStart} />
                    </div>
                    <div>
                        <h4>Export End</h4>
                        <Datebox date={new Date(savedSettings.semesterEnd)} update={handleExportEnd} />
                    </div>
                </div>
                {(exportFlips || exportDeclines) && (
                    <div style={{ gap: "0.5rem", display: "flex" }}>
                        {!(exportFlips && exportDeclines) && (
                            <button className="accent check-btn no-margin" onClick={() => onExport("csv")}>
                                <Download size={20} />
                                <span>Export .csv</span>
                            </button>
                        )}
                        <button className="accent check-btn no-margin" onClick={() => onExport("xlsx")} style={{ backgroundColor: "#107c41" }}>
                            <Sheet size={20} />
                            <span>Export .xlsx</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}