import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 Ye Line HONI CHAHIYE
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 Ye BrowserRouter Bahut Zaruri Hai */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)