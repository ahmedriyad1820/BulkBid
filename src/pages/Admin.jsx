import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card.jsx'
import PieChart from '../components/PieChart.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { Users, Eye, BarChart3 } from 'lucide-react'
import { getAuctionStats } from '../services/api.js'

export default function Admin({ updateAdminState }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [auctionStats, setAuctionStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
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

  // Fetch auction statistics
  useEffect(() => {
    const fetchAuctionStats = async () => {
      try {
        const response = await getAuctionStats()
        if (response.success) {
          setAuctionStats(response.data)
        }
      } catch (error) {
        console.error('Error fetching auction stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    if (isAdmin) {
      fetchAuctionStats()
    }
  }, [isAdmin])


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
  // Prepare pie chart data
  const pieChartData = auctionStats ? [
    {
      label: 'Running Auctions',
      value: auctionStats.running,
      color: '#10B981' // green
    },
    {
      label: 'Completed Auctions',
      value: auctionStats.completed,
      color: '#3B82F6' // blue
    },
    {
      label: 'Draft Auctions',
      value: auctionStats.draft,
      color: '#F59E0B' // yellow
    },
    {
      label: 'Cancelled Auctions',
      value: auctionStats.cancelled,
      color: '#EF4444' // red
    }
  ] : []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-300">Moderate auctions, verify sellers, and review disputes.</p>
      </div>

      {/* Auction Statistics Pie Chart */}
      <Card className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold">Auction Statistics</h2>
        </div>
        
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading statistics...</p>
            </div>
          </div>
        ) : auctionStats ? (
          <PieChart data={pieChartData} size={250} />
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <BarChart3 className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">No auction data available</p>
          </div>
        )}
      </Card>

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
          <div className="mb-3">
            <h3 className="text-lg font-semibold">User Management</h3>
          </div>
          <div className="space-y-3 text-sm">
            <Link 
              to="/admin/users" 
              className="block"
            >
              <div className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">All Users</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Buyers & Sellers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">Active</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Click to manage</div>
                </div>
              </div>
            </Link>
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
