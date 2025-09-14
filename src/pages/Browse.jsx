import React, { useMemo, useState, useEffect } from 'react'
import Dropdown from '../components/Dropdown.jsx'
import Card from '../components/ui/Card.jsx'
import AuctionGrid from '../components/AuctionGrid.jsx'
import { Search, Loader2 } from 'lucide-react'
import { CATS, LOCS } from '../data/mockData.js'
import { getAuctions } from '../services/api.js'

export default function Browse() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [loc, setLoc] = useState('All')
  const [sort, setSort] = useState('ending')
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true)
        const response = await getAuctions()
        if (response.auctions) {
          setAuctions(response.auctions)
        }
      } catch (err) {
        console.error('Error fetching auctions:', err)
        setError('Failed to load auctions')
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  const filtered = useMemo(() => {
    let list = [...auctions]
    if (q) list = list.filter(a => a.title.toLowerCase().includes(q.toLowerCase()))
    if (cat !== 'All') list = list.filter(a => a.category === cat)
    if (loc !== 'All') list = list.filter(a => a.location === loc)
    if (sort === 'ending') list.sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
    if (sort === 'price') list.sort((a, b) => (b.currentBid || 0) - (a.currentBid || 0))
    return list
  }, [auctions, q, cat, loc, sort])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-gray-600">Loading auctions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border px-3 dark:border-gray-600 dark:bg-gray-800">
            <Search size={16} className="dark:text-gray-400" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search lots, sellers..." className="w-full py-2 outline-none dark:bg-transparent dark:text-white dark:placeholder-gray-400" />
          </div>
          <Dropdown label="Category" value={cat} setValue={setCat} options={['All', ...CATS]} />
          <Dropdown label="Location" value={loc} setValue={setLoc} options={['All', ...LOCS]} />
          <Dropdown label="Sort by" value={sort} setValue={setSort} options={['ending','price']} />
        </div>
      </Card>
      
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Auctions Found</h3>
            <p className="text-gray-500 mb-4">
              {auctions.length === 0 
                ? "There are no auctions available at the moment." 
                : "No auctions match your search criteria."
              }
            </p>
            {auctions.length === 0 && (
              <a 
                href="/sell" 
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create First Auction
              </a>
            )}
          </div>
        </div>
      ) : (
        <AuctionGrid auctions={filtered} />
      )}
    </div>
  )
}
