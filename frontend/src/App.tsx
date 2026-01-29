import {useEffect, useState} from 'react';
import './App.css';
import { PageType, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { SettingsPage } from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import { DebugPage } from './pages/DebugPage';
import { OctagonAlert, User } from 'lucide-react';

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
                <div className="pageContainer">
                    <Header />
                    <div className='container'>
                        <div className='form-div'>
                            <p>Flip Patron</p>
                            <div className='flex input-button'>
                                <input type="text" placeholder='Eagle Id'></input>
                                <button className='accent check-btn'><User size={16}/><span>Check</span></button>
                            </div>
                        </div>
                    </div>
                    {
                        <div className='container'>
                            <div className='error-badge'>
                                <OctagonAlert size={20}/>
                                <span>This user has reached the maximum amount of flips for the semester.</span>
                            </div>
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
