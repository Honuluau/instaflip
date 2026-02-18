import { Ban, Calendar, ClockAlert, Octagon, Repeat, StopCircle, User, WarehouseIcon, X } from "lucide-react";
import { CanFlipBanner, MaximumFlipsReachedBanner } from "../components/Banners";
import { FlipInstance } from "../components/FlipInstance";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";

import { CheckFlipsDB, CheckVersion, DeleteFlip, FlipPatronDB } from "../../wailsjs/go/main/App";
import { backend } from "../../wailsjs/go/models";
import { logger } from "../lib/logger";
import { getSettings, type Settings as SettingsType } from "../lib/settings";
import { Overlay } from "../components/Overlay";
import { toaster } from "../lib/toaster";
import { version } from "../App";

export function HomePage() {
    const [settings, setSettings] = useState<SettingsType>(getSettings());
    const [eagleId, setEagleId] = useState("");
    const [flips, setFlips] = useState<backend.FlipRowItem[]>([]);
    const [currentFlips, setCurrentFlips] = useState<backend.FlipRowItem[]>([]);
    const [otherFlips, setOtherFlips] = useState<backend.FlipRowItem[]>([]);
    const [checked, setChecked] = useState(Boolean);
    const [outOfDate, setOutOfDate] = useState(Boolean);
    const [releaseVersion, setReleaseVersion] = useState<string>(version);

    const checkPatron = async () => {
        try {
            const _flips = await CheckFlipsDB(eagleId)
            setChecked(true)

            if (_flips === null) {
                setFlips([])
                setCurrentFlips([])
                setOtherFlips([])
                return
            }

            let _currentFlips: backend.FlipRowItem[] = []
            let _otherFlips: backend.FlipRowItem[] = []

            for (const flip of _flips) {
                console.log(flip, settings.semesterStart, settings.semesterEnd)
                if (settings.semesterStart < flip.FlipTime && flip.FlipTime < settings.semesterEnd) {
                    _currentFlips.push(flip);
                } else {
                    _otherFlips.push(flip)
                }
            }

            setFlips(_flips)
            setCurrentFlips(_currentFlips)
            setOtherFlips(_otherFlips)
        } catch (err) {
            logger.error(`Failed to check flips for patron ${eagleId}`)
            console.error(`Failed to check flips for patron ${eagleId}. Error:`, err)
            setChecked(false)
        }
    }

    const handleKeyDown = (key: string) => {
        if (key === 'Enter') {
            checkPatron();
        }
    }

    const cancelFlip = () => {
        setEagleId("");
        setChecked(false);
    }

    const flipPatron = () => {
        try {
            FlipPatronDB(eagleId)
            cancelFlip()

            logger.success(`Flipped ${eagleId}.`)
            toaster.addToast('SUCCESS', `Successfully flipped ${eagleId}`, 3000);
        } catch (err) {
            logger.error(`Failed to flip ${eagleId}.`)
            console.error(`Failed to flip ${eagleId}. Err:`, err)
            toaster.addToast('ERROR', `Failed to flip ${eagleId}`, 3000);
        }
    }

    const checkSettingsOutOfDate = () => {
        let currentEpoch: number = Date.now();
        if (settings.semesterStart < currentEpoch && currentEpoch < settings.semesterEnd) {
            setOutOfDate(false);
        } else {
            setOutOfDate(true);
        }
    }

    const deleteFlip = async (id: number, date: number) => {
        console.log(`recieved ${id} and ${date} with ${eagleId}`);
        const success = await DeleteFlip(eagleId, date);

        if (success) { // This error is wrong.
            const msg = `Deleted ${date} for ${eagleId}.`;
            logger.success(msg);
            toaster.addToast('SUCCESS', msg, 3000);
            checkPatron();
        } else {
            const msg = `Failed to delete ${date} for ${eagleId}`;
            logger.error(msg);
            toaster.addToast('ERROR', msg, 3000);
        }
    }

    const checkVersion = async () => {
        let response = await CheckVersion();
        if (response != "") { // "" is default for no response e.g no wifi or failed response.
            setReleaseVersion(response)
        }
    }

    useEffect(() => {
        setSettings(settings);
        checkSettingsOutOfDate();
        console.log(checkVersion())
    }, [])

    return (
        <>
            {(outOfDate && !settings.disabled) ? (
                <>
                    <Overlay icon={<Calendar />} label="Semester Range is out of date." text="Please change the semester settings by clicking the calendar button on the left-side of this window. The semester range is derived from Academic Calendars. Academic Calendars are available through the Office of the Registrar on Georgia Southern's website." />
                </>
            ) : (
                <></>
            )}

            {(version != releaseVersion) ? (
                <>
                    <Overlay icon={<ClockAlert />} label="Outdated Version" text={`InstaFlip is currently on version ${releaseVersion}. This machine's version is on ${version}. Please update InstaFlip via GitHub.`} />
                </>
            ) : (
                <></>
            )}

            {(settings.disabled) ? (
                <>
                    <Overlay icon={<Ban />} label="Disabled for Finals" text="InstaFlip is currently disabled for Finals week. Please do not undo this action without permission." />
                </>
            ) : (
                <></>
            )
            }

            <div className="pageContainer">
                <Header />
                <div className='container'>
                    <div className='form-div'>
                        <h2>Flip Patron</h2>
                        <div className='flex input-button'>
                            <input
                                type="text"
                                placeholder='Eagle Id'
                                onChange={(e) => {
                                    setEagleId(e.target.value)
                                    setChecked(false)
                                }}
                                value={eagleId}
                                onKeyDown={(e) => handleKeyDown(e.key)}
                                className="eagle-id-input"
                            ></input>
                            <button className='accent check-btn' onClick={checkPatron}><User size={16} /><span>Check</span></button>
                        </div>
                    </div>
                </div>
                {checked && (
                    currentFlips.length < settings.maxFlips ? (
                        <>
                            <CanFlipBanner patron={eagleId} flips={settings.maxFlips - currentFlips.length} />
                        </>
                    ) : (
                        <MaximumFlipsReachedBanner patron={eagleId} />
                    )
                )}
                {checked && (
                    <>
                        <div className='container flex-col'>
                            <div className='semesters-header'>
                                <h2>Current Semester</h2>
                            </div>
                            <div className='semesters'>
                                {currentFlips.length == 0 ? (
                                    <div className='wide-center'><span>No recorded flips from this semester.</span></div>
                                ) : (
                                    <>
                                        {currentFlips?.map((flip: backend.FlipRowItem, i) => (
                                            <FlipInstance key={i} id={i} date={flip.FlipTime} deleteFlip={deleteFlip} />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='container button-row'>
                            {(currentFlips.length < settings.maxFlips) ? (
                                <>
                                    <div className='colorful-card'>
                                        <button className='flip-btn' onClick={flipPatron}>
                                            <Repeat size={20} />
                                            <span>Flip Patron</span>
                                        </button>
                                    </div>
                                    <button className='flip-btn cancel' onClick={cancelFlip}>
                                        <X size={20} />
                                        <span>Cancel</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="colorful-card decline">
                                        <button className="flip-btn decline">
                                            <Ban size={20} />
                                            <span>Decline</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {otherFlips.length > 0 && (
                            <div className='container flex-col'>
                                <div className='semesters-header'>
                                    <h2>Other</h2>
                                </div>
                                <div className='semesters'>
                                    {otherFlips.length == 0 ? (
                                        <div className='wide-center'><span>No recorded flips from this semester.</span></div>
                                    ) : (
                                        <>
                                            {otherFlips?.map((flip: backend.FlipRowItem, i) => (
                                                <FlipInstance key={i} id={i} date={flip.FlipTime} deleteFlip={deleteFlip} />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}