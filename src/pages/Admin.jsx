import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { Users, Eye } from 'lucide-react'

export default function Admin({ updateAdminState }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    // Check if user is admin
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken')
      const isAdminFlag = localStorage.getItem('isAdmin')
      
      if (!adminToken || !isAdminFlag) {
        // Not admin, redirect to home
        nav('/')
        return
      }
      
      setIsAdmin(true)
      setLoading(false)
    }

    checkAdminAuth()
  }, [nav])


  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Don't render anything if not admin
  }
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-300">Moderate auctions, verify sellers, and review disputes.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Seller Verifications</h3>
            <button className="rounded-xl px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">View all</button>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">No pending verifications</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">All sellers are verified</p>
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Flagged Auctions</h3>
            <button className="rounded-xl px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">View all</button>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">No flagged auctions</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">All auctions are clean</p>
          </div>
        </Card>
        
        {/* User Management Card */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Link 
              to="/admin/users" 
              className="rounded-xl px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Manage Users
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">All Users</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Buyers & Sellers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">Active</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Manage accounts</div>
              </div>
            </div>
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                View and manage all user accounts, activate/deactivate users, and view detailed profiles.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
