import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import AuctionDetail from './pages/AuctionDetail.jsx'
import SellCreate from './pages/SellCreate.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import StaticPage from './pages/StaticPage.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  // Check for admin state on app load
  useEffect(() => {
    const checkAdminState = () => {
      const adminFlag = localStorage.getItem('isAdmin')
      const email = localStorage.getItem('adminEmail')
      
      if (adminFlag === 'true' && email) {
        setIsAdmin(true)
        setAdminEmail(email)
      } else {
        setIsAdmin(false)
        setAdminEmail('')
      }
    }

    checkAdminState()

    // Listen for storage changes (when admin logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isAdmin' || e.key === 'adminEmail') {
        checkAdminState()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Update admin state when it changes
  const updateAdminState = (adminFlag, email = '') => {
    setIsAdmin(adminFlag)
    setAdminEmail(email)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Header 
          user={user} 
          setUser={setUser} 
          isAdmin={isAdmin} 
          adminEmail={adminEmail}
          updateAdminState={updateAdminState}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/sell" element={<SellCreate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin updateAdminState={updateAdminState} />} />
            <Route path="/login" element={<Login setUser={setUser} updateAdminState={updateAdminState} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/terms" element={<StaticPage title="Terms & Conditions">Coming soon.</StaticPage>} />
            <Route path="/privacy" element={<StaticPage title="Privacy">Coming soon.</StaticPage>} />
            <Route path="/help" element={<StaticPage title="Help Center">Email support@bulkbid.example</StaticPage>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
