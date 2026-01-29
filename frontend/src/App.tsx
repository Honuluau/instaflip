import { useEffect, useState } from 'react';
import './App.css';
import { PageType, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { SettingsPage } from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import { DebugPage } from './pages/DebugPage';
import { Check, Cross, EllipsisVertical, EyeOff, OctagonAlert, Repeat, User, X } from 'lucide-react';
import { InfoPage } from './pages/InfoPage';
import { FlipInstance } from './components/FlipInstance';
import { CanFlipBanner, MaximumFlipsReachedBanner } from './components/Banners';

export const version = "v1.0_dev"

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>("main");

    const renderPage = () => {
        switch (currentPage) {
            case "settings":
                return <SettingsPage />
            case "statistics":
                return <StatisticsPage />
            case "debug":
                return <DebugPage />
            case "info":
                return <InfoPage />
            default:
                return (
                    <div className="pageContainer">
                        <Header />
                        <div className='container'>
                            <div className='form-div'>
                                <h3>Flip Patron</h3>
                                <div className='flex input-button'>
                                    <input type="text" placeholder='Eagle Id'></input>
                                    <button className='accent check-btn'><User size={16} /><span>Check</span></button>
                                </div>
                            </div>
                        </div>
                        {
                            <CanFlipBanner />
                        }
                        {
                            <div className='container flex-col'>
                                <div className='semesters-header'>
                                    <h2>Current Semester</h2>
                                    <div className='semesters-actions'>
                                        <div className='select-all'>
                                            <input type='checkbox' />
                                            <span>Select All</span>
                                        </div>
                                        <button className='ineligible'>
                                            <EyeOff size={16} />
                                            <span>Hide Selected</span>
                                        </button>
                                    </div>
                                </div>
                                <div className='semesters'>
                                    <FlipInstance />
                                    <FlipInstance />
                                </div>
                            </div>
                        }
                        {
                            <div className='container button-row'>
                                <div className='colorful-card'>
                                    <button className='flip-btn'>
                                        <Repeat size={20} />
                                        <span>Flip Patron</span>
                                    </button>
                                </div>
                                <button className='flip-btn cancel'>
                                    <X size={20} />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        }
                    </div>
                )
        }
    }

    return (
        <div className="root" id="root">
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

            <div className="flex1 flex-col">
                <Topbar />
                {renderPage()}
            </div>
        </div>
    )
}

export default App
