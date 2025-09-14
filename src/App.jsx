import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import AuctionDetail from './pages/AuctionDetail.jsx'
import SellCreate from './pages/SellCreate.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import StaticPage from './pages/StaticPage.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminData, setAdminData] = useState(null)

  // Check for user login state on app load
  useEffect(() => {
    const checkUserState = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // Verify token and get user data
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token')
            setUser(null)
          }
        } catch (error) {
          console.error('Error verifying token:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }
    }

    const checkAdminState = async () => {
      const adminFlag = localStorage.getItem('isAdmin')
      const email = localStorage.getItem('adminEmail')
      const adminToken = localStorage.getItem('adminToken')
      
      if (adminFlag === 'true' && email && adminToken) {
        try {
          // Verify admin token
          const response = await fetch('http://localhost:5000/api/admin/profile', {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          })
          
          if (response.ok) {
            const adminResponse = await response.json()
            const adminData = adminResponse.admin
            setIsAdmin(true)
            setAdminEmail(email)
            setAdminData(adminData)
            setUser(null) // Clear user state when admin is logged in
          } else {
            // Admin token is invalid, clear it
            localStorage.removeItem('adminToken')
            localStorage.removeItem('isAdmin')
            localStorage.removeItem('adminEmail')
            setIsAdmin(false)
            setAdminEmail('')
            setAdminData(null)
          }
        } catch (error) {
          console.error('Error verifying admin token:', error)
          localStorage.removeItem('adminToken')
          localStorage.removeItem('isAdmin')
          localStorage.removeItem('adminEmail')
          setIsAdmin(false)
          setAdminEmail('')
          setAdminData(null)
        }
      } else {
        setIsAdmin(false)
        setAdminEmail('')
        setAdminData(null)
      }
    }

    checkUserState()
    checkAdminState()

    // Listen for storage changes (when admin logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isAdmin' || e.key === 'adminEmail') {
        checkAdminState()
      }
      if (e.key === 'token') {
        checkUserState()
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

  // Clear admin state when regular user is set
  useEffect(() => {
    if (user && !isAdmin) {
      // If we have a regular user and we're not in admin mode, ensure admin state is cleared
      const adminFlag = localStorage.getItem('isAdmin')
      if (adminFlag === 'true') {
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('adminEmail')
        setIsAdmin(false)
        setAdminEmail('')
      }
    }
  }, [user, isAdmin])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Header 
          user={user} 
          setUser={setUser} 
          isAdmin={isAdmin} 
          adminEmail={adminEmail}
          adminData={adminData}
          updateAdminState={updateAdminState}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/sell" element={
              (user?.role === 'seller' || isAdmin) ? 
                <SellCreate /> : 
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Only sellers can access the Sell page.</p>
                    <Link to="/browse" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Browse Auctions
                    </Link>
                  </div>
                </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin updateAdminState={updateAdminState} />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/login" element={<Login setUser={setUser} updateAdminState={updateAdminState} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/profile" element={<Profile setUser={setUser} />} />
            <Route path="/admin-profile" element={<AdminProfile setUser={setUser} setAdminData={setAdminData} />} />
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
