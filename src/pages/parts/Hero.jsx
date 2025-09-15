import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button.jsx'
import { Gavel, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAuctions } from '../../services/api.js'

export default function Hero({ user, isAdmin }) {
  const [liveAuction, setLiveAuction] = useState(null)

  useEffect(() => {
    const loadLive = async () => {
      try {
        const data = await getAuctions({ status: 'active', limit: 1, sortBy: 'endTime', sortOrder: 'asc' })
        if (data && Array.isArray(data.auctions) && data.auctions.length > 0) {
          setLiveAuction(data.auctions[0])
        }
      } catch (_) {
        // ignore – show static fallback
      }
    }
    loadLive()
  }, [])

  const liveTitle = liveAuction?.title || 'Textile Pallets x 12'
  const liveCurrent = typeof liveAuction?.currentBid === 'number' ? liveAuction.currentBid : 4300
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl dark:text-white">Buy & Sell Bulk Inventory by Live Bidding</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Transparent auctions for pallets, surplus and wholesale lots. Real-time pricing, anti-sniping, and escrow support.</p>
            <div className="flex gap-3">
              <Link to="/browse"><Button icon={Gavel}>Browse Auctions</Button></Link>
              {user && (user.role === 'seller' || isAdmin) && (
                <Link to="/sell"><Button variant="outline" icon={Plus}>Create Auction</Button></Link>
              )}
            </div>
          </div>
          <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <img alt="hero" className="w-full rounded-3xl border shadow" src="https://images.unsplash.com/photo-1515165562835-c3b8cce1f9a0?q=80&w=1600&auto=format&fit=crop"/>
            <div className="absolute -bottom-5 -left-5 hidden w-fit rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-3 shadow md:block">
              <div className="text-xs text-gray-500 dark:text-gray-400">Live now</div>
              <div className="font-semibold dark:text-white whitespace-nowrap">{liveTitle}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Current: ${liveCurrent.toLocaleString()}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
