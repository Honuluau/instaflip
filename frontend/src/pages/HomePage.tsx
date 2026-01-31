import { Repeat, User, X } from "lucide-react";
import { CanFlipBanner, MaximumFlipsReachedBanner } from "../components/Banners";
import { FlipInstance } from "../components/FlipInstance";
import { Header } from "../components/Header";
import { useState } from "react";

import { CheckFlipsDB, FlipPatronDB } from "../../wailsjs/go/main/App";
import { backend } from "../../wailsjs/go/models";

export function HomePage() {
    const [eagleId, setEagleId] = useState("");
    const [flips, setFlips] = useState<backend.FlipRowItem[]>([]);
    const [checked, setChecked] = useState(Boolean);

    const checkPatron = async () => {
        try {
            const _flips = await CheckFlipsDB(eagleId)
            setChecked(true)

            if (_flips === null) {
                setFlips([])
                return
            }

            setFlips(_flips)
        } catch (err) {
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
        FlipPatronDB(eagleId)
        cancelFlip()
    }

    return (
        <div className="pageContainer">
            <Header />
            <div className='container'>
                <div className='form-div'>
                    <h2>Flip Patron</h2>
                    <div className='flex input-button'>
                        <input
                            type="text"
                            placeholder='Eagle Id'
                            onChange={(e) => setEagleId(e.target.value)}
                            value={eagleId}
                            onKeyDown={(e) => handleKeyDown(e.key)}
                        ></input>
                        <button className='accent check-btn' onClick={checkPatron}><User size={16} /><span>Check</span></button>
                    </div>
                </div>
            </div>
            {checked && (
                flips.length < 2 ? (
                    <>
                        <CanFlipBanner flips={2 - flips.length} />
                    </>
                ) : (
                    <MaximumFlipsReachedBanner />
                )
            )}
            {checked && (
                <>
                    <div className='container flex-col'>
                        <div className='semesters-header'>
                            <h2>Current Semester</h2>
                        </div>
                        <div className='semesters'>
                            {

                            }
                            <div className='wide-center'><span>No recorded flips from this semester.</span></div>
                        </div>
                    </div>

                    <div className='container button-row'>
                        {flips.length < 2 && (
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

                    <div className='container flex-col'>
                        <div className='semesters-header'>
                            <h2>Other</h2>
                        </div>
                        <div className='semesters'>
                            <FlipInstance id={1} date='January 29th, 2026 at 12:24 PM' />
                            <FlipInstance id={2} date='March 11th, 2026 at 6:88 PM' />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}