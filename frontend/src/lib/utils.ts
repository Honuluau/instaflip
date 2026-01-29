import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";

export function openExternalURL(url: string) {
    if (!url) return;
    
    try {
        BrowserOpenURL(url)
    } catch (error) {
    }
}