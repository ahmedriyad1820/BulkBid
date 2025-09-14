import React from 'react'
import { Link } from 'react-router-dom'
import { Hammer, Search, Plus, CircleUser, LogIn, LogOut } from 'lucide-react'
import Button from './ui/Button.jsx'
import Badge from './ui/Badge.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import api from '../services/api.js'

const NavLink = ({ to, children }) => (
  <Link to={to} className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
    {children}
  </Link>
)

export default function Header({ user, setUser }) {
  const handleLogout = () => {
    api.logout()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Hammer className="h-6 w-6" />
          <span className="text-lg font-semibold">BulkBid</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/browse">Browse</NavLink>
          <NavLink to="/sell">Sell</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/browse" className="hidden md:block">
            <Button variant="outline" icon={Search}>Search</Button>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Badge><CircleUser className="mr-1 inline" size={14}/> {user.name}</Badge>
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
