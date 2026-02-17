import { Calendar, CalendarFold, Folder, Save } from "lucide-react";
import { Datebox } from "../components/Datebox";
import { getSettings, saveSettings, type Settings as SettingsType } from "../lib/settings";
import { useEffect, useState } from "react";
import { logger } from "../lib/logger";
import { SelectFolder } from "../../wailsjs/go/main/App";
import { toaster } from "../lib/toaster";
import { Switch } from "../components/Switch";

export function SettingsPage() {
    const [savedSettings, setSavedSettings] = useState<SettingsType>(getSettings());
    const [tempSettings, setTempSettings] = useState<SettingsType>(savedSettings);
    const [difference, setDifference] = useState<Boolean>(false);

    const onSave = () => {
        // Log Differences
        let log = "{";
        const keys = Object.keys(savedSettings) as Array<keyof SettingsType>;

        keys.forEach(key => {
            if (savedSettings[key] !== tempSettings[key]) {
                log += `${key}: ${tempSettings[key]}, `
            }
        })

        log = log.slice(0, -2);
        log += '}'

        // Save Settings

        saveSettings(tempSettings);
        setSavedSettings(tempSettings);
        checkDifference(savedSettings);

        logger.success(`Saved settings. ${log}`)
        toaster.addToast("SUCCESS", "Successfully updated settings!", 3000);
    }

    const checkDifference = (settings: SettingsType) => {
        const keys = Object.keys(savedSettings) as Array<keyof SettingsType>;
        let _difference = false;

        keys.forEach(key => {
            if (savedSettings[key] !== settings[key]) {
                _difference = true;
            }
        })

        setDifference(_difference);
    }

    const handleSemesterStart = (epochNum: number) => {
        try {
            const updated = { ...tempSettings, semesterStart: epochNum }
            setTempSettings(updated);
            checkDifference(updated);
        } catch (err) {
            console.error("Error setting start of semester:", err)
            logger.error("Error setting start of semester.")
        }
    }

    const handleSemesterEnd = (epochNum: number) => {
        try {
            const updated = { ...tempSettings, semesterEnd: epochNum }
            setTempSettings(updated);
            checkDifference(updated);
        } catch (err) {
            console.error("Error setting end of semester:", err)
            logger.error("Error setting end of semester.")
        }
    }

    const handleMaxFlips = (e: React.ChangeEvent<HTMLInputElement>) => {
        let flipAmount = e.target.valueAsNumber || 2

        try {
            const updated = { ...tempSettings, maxFlips: flipAmount }
            setTempSettings(updated)
            checkDifference(updated);
        } catch (err) {
            console.error("Error setting max flips per semester:", err)
            logger.error("Error setting max flips per semester.")
        }
    }

    const onBrowse = async () => {
        try {
            const selectedPath = await SelectFolder(tempSettings.statisticsOutputPath || "")

            if (selectedPath != "") {
                const updated = { ...tempSettings, statisticsOutputPath: selectedPath }
                setTempSettings(updated)
                checkDifference(updated)
            }
        } catch (error) {
            console.error("Error selecting folder:", error)
            logger.error("Error selecting folder.")
        }
    }

    const disableInstaFlipForFinals = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const updated = { ...tempSettings, disabled: e.target.checked }
            setTempSettings(updated);
            checkDifference(updated);
        } catch (error) {
            console.error("Error disabling instaflip for finals:", error)
            logger.error("Error Disable InstaFlipForFinals")
        }
    }

    useEffect(() => {

    }, [difference])

    return (
        <div className="container no-top-margin flex-col justify-start">
            <h1 className="page-header">Settings</h1>
            <div className="semester-date-settings">
                <div>
                    <h4>Semester Start</h4>
                    <Datebox date={new Date(savedSettings.semesterStart)} update={handleSemesterStart} />
                </div>
                <div>
                    <h4>Semester End</h4>
                    <Datebox date={new Date(savedSettings.semesterEnd)} update={handleSemesterEnd} />
                </div>
            </div>
            <div className="semester-date-settings">
                <div className="flex-col">
                    <h4>Maximum Amount of Flips per Semester</h4>
                    <input type='number' placeholder={savedSettings.maxFlips.toString()} onChange={handleMaxFlips} />
                </div>
            </div>
            <div className="semester-date-settings">
                <div className="flex-col">
                    <h4>Export Folder Path</h4>
                    <div className="flex-row">
                        <input placeholder={tempSettings.statisticsOutputPath} />
                        <button className="accent check-btn no-margin" onClick={onBrowse}>
                            <Folder size={16} />
                            <span>Browse</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="semester-date-settings">
                <div className="flex-row settings-toggle">
                    <div className="flex-col">
                        <h4>Disable InstaFlip for Finals</h4>
                        <span>* Use with permission.</span>
                    </div>
                    <Switch onChange={disableInstaFlipForFinals} />
                </div>
            </div>
            <div>
                {difference ?
                    <button className="accent check-btn no-margin" onClick={onSave}>
                        <Save size={20} />
                        <span>Save Changes</span>
                    </button> : <></>}
            </div>
        </div>
    )
}