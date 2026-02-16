import { useEffect, useState } from 'react';
import './App.css';
import { PageType, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { SettingsPage } from './pages/SettingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { DebugPage } from './pages/DebugPage';
import { Check, Cross, EllipsisVertical, EyeOff, OctagonAlert, Repeat, User, X } from 'lucide-react';
import { InfoPage } from './pages/InfoPage';
import { FlipInstance } from './components/FlipInstance';
import { CanFlipBanner, MaximumFlipsReachedBanner } from './components/Banners';
import { HomePage } from './pages/HomePage';
import { ToastContainer } from './components/ToastContainer';

export const version = "v1.0"

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
                return <HomePage />
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="root" id="root">
                <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

                <div className="flex1 flex-col">
                    <Topbar />
                    {renderPage()}
                </div>
            </div>
        </>
    )
}

export default App
