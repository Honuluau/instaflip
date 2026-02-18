import { useState } from "react";
import { Datebox } from "../components/Datebox";
import { getSettings, Settings as SettingsType } from "../lib/settings";
import { Ban, Bell, Download, Repeat } from "lucide-react";
import { ExportStatistics } from "../../wailsjs/go/main/App";
import { logger } from "../lib/logger";
import { toaster } from "../lib/toaster";
import { Switch } from "../components/Switch";
import { Dropdown } from "../components/Dropdown";

export function StatisticsPage() {
    const [savedSettings, setSavedSettings] = useState<SettingsType>(getSettings());
    const [exportStart, setExportStart] = useState<number>(savedSettings.semesterStart);
    const [exportEnd, setExportEnd] = useState<number>(savedSettings.semesterEnd);

    const handleExportStart = (epochNum: number) => {
        setExportStart(epochNum)
    }

    const handleExportEnd = (epochNum: number) => {
        setExportEnd(epochNum)
    }

    const onExport = async () => {
        const exported = await ExportStatistics(exportStart, exportEnd, savedSettings.statisticsOutputPath)
        if (exported) {
            logger.success(`Exported Data from ${exportStart} -> ${exportEnd} to "${savedSettings.statisticsOutputPath}"`)
            toaster.addToast("SUCCESS", "Successfuly exported!", 3000);
        } else {
            toaster.addToast("ERROR", "Failed to download data.", 300);
        }
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
                        <Switch />
                    </div>
                    <div className="flex-row statistic-switch">
                        <Ban />
                        <h4>Declines</h4>
                        <Switch />
                    </div>
                </div>
            </div>

            <div className="flex-row">
                <div className="flex-col">
                    <h2>Export Style</h2>
                    <Dropdown options={["Unix Milliseconds", "Datetime", "Year, Month, & Timestamp"]} />
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
                <div>
                    <button className="accent check-btn no-margin" onClick={onExport}>
                        <Download size={20} />
                        <span>Export .csv</span>
                    </button>
                </div>
            </div>
        </div>
    )
}