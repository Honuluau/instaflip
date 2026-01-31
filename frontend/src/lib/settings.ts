export interface Settings {
    semesterStart: number;
    semesterEnd: number;
    maxFlips: number;
}

export const DEFAULT_SETTINGS: Settings = {
    semesterStart: Date.parse("2000-01-01"),
    semesterEnd: Date.parse("2001-01-01"),
    maxFlips: 2
}

const SETTINGS_KEY = "instaflip-settings"

export function getSettings(): Settings {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {...DEFAULT_SETTINGS, ...parsed}
        }
    } catch (err) {
        console.error("Failed to load settings:", err);
    }

    return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
        console.error("Failed to save settings:", err)
    }
}