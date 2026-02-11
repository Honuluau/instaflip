import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import App from './App'
import { logger } from './lib/logger'

const container = document.getElementById('root')

const root = createRoot(container!)

logger.info("InstaFlip started.")

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
