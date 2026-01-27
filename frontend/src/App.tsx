import {useEffect, useState} from 'react';
import './App.css';
import { PageType, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Header } from './components/Header';

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>("main");

    const renderPage = () => {
        switch(currentPage) {
            default: 
            return (
                <div className="flex1">
                    <Header />
                    <p>Hello, world!</p>
                    <p>HELP</p>
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
