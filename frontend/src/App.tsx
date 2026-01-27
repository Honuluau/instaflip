import {useEffect, useState} from 'react';
import './App.css';
import { PageType, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { SettingsPage } from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import { DebugPage } from './pages/DebugPage';

export const version = "v1.0_dev"

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>("main");

    const renderPage = () => {
        switch(currentPage) {
            case "settings":
                return <SettingsPage />
            case "statistics":
                return <StatisticsPage />
            case "debug":
                return <DebugPage />
            default: 
            return (
                <div className="flex1">
                    <Header />
                    <h3>Home Page</h3>
                </div>
            )
        }
    }

    return (
            <div className="flex-row" id="root">
                <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

                <div className="flex1 flex-col">
                    <Topbar />
                    <div className="pageContainer">
                        {renderPage()}
                    </div>
                </div>
            </div>
    )
}

export default App
