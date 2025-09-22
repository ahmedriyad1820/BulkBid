import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card.jsx'
import AuctionGrid from '../components/AuctionGrid.jsx'
import { Loader2 } from 'lucide-react'
import Hero from './parts/Hero.jsx'
import { Link } from 'react-router-dom'
import { getAuctions } from '../services/api.js'

export default function Home({ user, isAdmin }) {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await getAuctions()
        if (response.auctions) {
          // Sort by end time and take first 8
          const sortedAuctions = response.auctions
            .sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
            .slice(0, 8)
          setAuctions(sortedAuctions)
        }
      } catch (err) {
        console.error('Error fetching auctions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  return (
    <>
      <Hero user={user} isAdmin={isAdmin} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold dark:text-white">Ending Soon</h2>
            <Link to="/browse" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                <p className="text-gray-600">Loading auctions...</p>
              </div>
            </div>
          ) : auctions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl mb-2">🏷️</div>
                <p className="text-gray-500">No auctions available</p>
                <Link 
                  to="/sell" 
                  className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create First Auction
                </Link>
              </div>
            </div>
          ) : (
            <AuctionGrid auctions={auctions} />
          )}
        </section>
        {/* Admin stats removed from Home. They're now shown in Admin page. */}
      </div>
    </>
  )
}
