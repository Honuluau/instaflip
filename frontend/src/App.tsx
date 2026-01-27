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
                <>
                    <Header />
                    <p>Hello, world!</p>
                    <p>HELP</p>
                </>
            )
        }
    }

    return (
        <div className="flex-col" id="root">
            <Topbar />
            <div className="flex-row">
                <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

                <div className="pageContainer">
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default App
