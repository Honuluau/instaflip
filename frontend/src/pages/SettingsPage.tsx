import { Calendar, CalendarFold, Save } from "lucide-react";
import { Datebox } from "../components/Datebox";
import { getSettings, saveSettings, type Settings as SettingsType } from "../lib/settings";
import { useEffect, useState } from "react";

export function SettingsPage() {
    const [savedSettings, setSavedSettings] = useState<SettingsType>(getSettings());
    const [tempSettings, setTempSettings] = useState<SettingsType>(savedSettings);

    const onSave = () => {
        saveSettings(tempSettings);
        setSavedSettings(tempSettings);
    }

    const handleSemesterStart = () => {
        try {

        } catch (err) {
            console.error("Error setting start of semester:", err)
        }
    }

    return (
        <div className="container no-top-margin flex-col justify-start">
            <h1 className="page-header">Settings</h1>
            <div className="semester-date-settings">
                <div>
                    <h4>Semester Start</h4>
                    <Datebox date='01/01/2026'/>
                </div>
                <div>
                    <h4>Semester End</h4>
                    <Datebox date='01/01/2027' />
                </div>
            </div>
            <div className="semester-date-settings">
                <div className="flex-col">
                    <h4>Maximum Amount of Flips per Semester</h4>
                    <input type='number' placeholder="2" />
                </div>
            </div>
            <div>
                <button className="accent check-btn no-margin" onClick={onSave}>
                    <Save size={20} />
                    <span>Save Changes</span>
                </button>
            </div>
        </div>
    )
}