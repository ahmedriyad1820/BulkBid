import React from 'react'
import { Link } from 'react-router-dom'
import { Hammer, Search, Plus, CircleUser, LogIn, LogOut, User } from 'lucide-react'
import Button from './ui/Button.jsx'
import Badge from './ui/Badge.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import api from '../services/api.js'

const NavLink = ({ to, children }) => (
  <Link to={to} className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
    {children}
  </Link>
)

export default function Header({ user, setUser, isAdmin, adminEmail, updateAdminState }) {
  const handleLogout = () => {
    api.logout()
    setUser(null)
  }

  const handleAdminLogout = () => {
    api.logout()
    updateAdminState(false, '')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Hammer className="h-6 w-6" />
          <span className="text-lg font-semibold">BulkBid</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {(user || isAdmin) && (
            <>
              <NavLink to="/browse">Browse</NavLink>
              {(user?.role === 'seller' || isAdmin) && <NavLink to="/sell">Sell</NavLink>}
              <NavLink to="/dashboard">Dashboard</NavLink>
            </>
          )}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {(user || isAdmin) && (
            <Link to="/browse" className="hidden md:block">
              <Button variant="outline" icon={Search}>Search</Button>
            </Link>
          )}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600 text-white"><CircleUser className="mr-1 inline" size={14}/> Admin: {adminEmail}</Badge>
              <Button variant="ghost" icon={LogOut} onClick={handleAdminLogout}>Logout</Button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user.profile?.avatar ? (
                    <img 
                      src={user.profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
              </Link>
              <Button variant="ghost" icon={LogOut} onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" icon={LogIn}>Login</Button></Link>
              <Link to="/register"><Button icon={Plus}>Sign Up</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
