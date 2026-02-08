import { Repeat, User, X } from "lucide-react";
import { CanFlipBanner, MaximumFlipsReachedBanner } from "../components/Banners";
import { FlipInstance } from "../components/FlipInstance";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";

import { CheckFlipsDB, FlipPatronDB } from "../../wailsjs/go/main/App";
import { backend } from "../../wailsjs/go/models";
import { logger } from "../lib/logger";
import { getSettings, type Settings as SettingsType } from "../lib/settings";
import { Overlay } from "../components/Overlay";

export function HomePage() {
    const [settings, setSettings] = useState<SettingsType>(getSettings());
    const [eagleId, setEagleId] = useState("");
    const [flips, setFlips] = useState<backend.FlipRowItem[]>([]);
    const [currentFlips, setCurrentFlips] = useState<backend.FlipRowItem[]>([]);
    const [otherFlips, setOtherFlips] = useState<backend.FlipRowItem[]>([]);
    const [checked, setChecked] = useState(Boolean);
    const [outOfDate, setOutOfDate] = useState(Boolean);

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
        } catch (err) {
            logger.error(`Failed to flip ${eagleId}.`)
            console.error(`Failed to flip ${eagleId}. Err:`, err)
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

    useEffect(() => {
        setSettings(settings);
        checkSettingsOutOfDate();
    }, [])

    return (
        <>
            {outOfDate? (
                <>
                    <Overlay label="Semesters are out of date." text="Please change the semester settings by clicking the calendar button on the left-side of this window."/>
                </>
            ): (
                <></>
            )}

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
                                            <FlipInstance key={i} id={i} date={flip.FlipTime} />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='container button-row'>
                            {currentFlips.length < settings.maxFlips && (
                                <div className='colorful-card'>
                                    <button className='flip-btn' onClick={flipPatron}>
                                        <Repeat size={20} />
                                        <span>Flip Patron</span>
                                    </button>
                                </div>
                            )}
                            <button className='flip-btn cancel' onClick={cancelFlip}>
                                <X size={20} />
                                <span>Cancel</span>
                            </button>
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
                                                <FlipInstance key={i} id={i} date={flip.FlipTime} />
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