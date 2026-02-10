import { useState } from "react";
import { Datebox } from "../components/Datebox";
import { getSettings, Settings as SettingsType } from "../lib/settings";
import { Download } from "lucide-react";
import { ExportStatistics } from "../../wailsjs/go/main/App";
import { logger } from "../lib/logger";

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
        }
    }

    return (
        <div className="container no-top-margin flex-col justify-start">
            <h1 className="page-header">Statistics</h1>
            <h2>Data Range</h2>
            <div className="semester-date-settings">
                <div>
                    <h4>Export Start</h4>
                    <Datebox date={new Date(savedSettings.semesterStart)} update={handleExportStart} />
                </div>
                <div>
                    <h4>Export End</h4>
                    <Datebox date={new Date(savedSettings.semesterEnd)} update={handleExportEnd}/>
                </div>
            </div>
            <div>
                <button className="accent check-btn no-margin" onClick={onExport}>
                    <Download size={20}/>
                    <span>Export</span>
                </button>
            </div>
        </div>
    )
}