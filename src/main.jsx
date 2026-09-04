import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ShopContextProvider } from './context/ShopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
