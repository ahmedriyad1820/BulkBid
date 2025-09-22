import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Countdown from '../components/Countdown.jsx'
import { Gavel, Clock, Store, Tag, Layers, Bell, Loader2, AlertCircle, Mail, Phone, X } from 'lucide-react'
import { getAuction, placeBid as placeBidAPI } from '../services/api.js'

export default function AuctionDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [auction, setAuction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bidding, setBidding] = useState(false)
  const [amount, setAmount] = useState(0)
  const [minAllowed, setMinAllowed] = useState(0)
  const [showSellerModal, setShowSellerModal] = useState(false)

  // Fetch auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAuction(id)
        setAuction(data)
        
        // Set initial bid amount and minimum
        const currentBid = data.currentBid || 0
        const startingBid = data.startingBid || 0
        const bidIncrement = 50 // Default increment, could be from API
        const min = Math.max(startingBid, currentBid + bidIncrement)
        
        setMinAllowed(min)
        setAmount(min)
      } catch (err) {
        console.error('Error fetching auction:', err)
        setError(err.message || 'Failed to load auction')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAuction()
    }
  }, [id])

  // Update amount when auction changes
  useEffect(() => {
    if (auction) {
      const currentBid = auction.currentBid || 0
      const startingBid = auction.startingBid || 0
      const bidIncrement = 50
      const min = Math.max(startingBid, currentBid + bidIncrement)
      setMinAllowed(min)
      setAmount(min)
    }
  }, [auction])

  const handlePlaceBid = async () => {
    if (!user) {
      alert('Please log in to place a bid')
      return
    }
    
    if (user.role !== 'buyer') {
      alert('Only buyers can place bids')
      return
    }

    if (amount < minAllowed) {
      alert(`Bid must be ≥ $${minAllowed}`)
      return
    }

    try {
      setBidding(true)
      const response = await placeBidAPI(id, amount)
      
      if (response.auction) {
        setAuction(response.auction)
        alert('Bid placed successfully!')
      }
    } catch (err) {
      console.error('Error placing bid:', err)
      alert(err.message || 'Failed to place bid')
    } finally {
      setBidding(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" />
            <p className="text-gray-700 dark:text-gray-300">Loading auction details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
          </div>
        </div>
      </div>
    )
  }

  // No auction found
  if (!auction) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">Auction not found</p>
            <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
          </div>
        </div>
      </div>
    )
  }

  // Get seller information
  const seller = auction.seller || {}
  const sellerName = seller.name || 'Unknown Seller'
  const sellerEmail = seller.email || ''
  
  // Get current bid display
  const currentBid = (auction.currentBid && auction.currentBid > 0) ? auction.currentBid : auction.startingBid
  const bidCount = auction.bidCount || 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {auction.images && auction.images.length > 0 ? (
              <img src={auction.images[0]} alt={auction.title} className="max-h-[420px] w-full object-cover" />
            ) : (
              <div className="max-h-[420px] w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-lg">No Image Available</span>
              </div>
            )}
            <div className="mt-4 space-y-2 p-2 sm:p-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{auction.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Badge>
                  <button
                    type="button"
                    onClick={() => setShowSellerModal(true)}
                    className="inline-flex items-center hover:underline focus:outline-none focus:underline"
                    title="View seller details"
                  >
                    <Store className="mr-1 inline" size={14} /> {sellerName}
                  </button>
                </Badge>
                <Badge><Tag className="mr-1 inline" size={14} /> {auction.category}</Badge>
                <Badge><Layers className="mr-1 inline" size={14} /> Grade {auction.grade}</Badge>
                <Badge>{auction.location}</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Card>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Current Bid</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${currentBid.toLocaleString()}
                  </div>
                </Card>
                <Card>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bids</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{bidCount}</div>
                </Card>
                <Card>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time Left</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white"><Countdown endsAt={auction.endTime} /></div>
                </Card>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Card>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quantity</div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">{auction.quantity.toLocaleString()} {auction.unit}</div>
                </Card>
                <Card>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reserve</div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">${auction.reservePrice.toLocaleString()}</div>
                </Card>
              </div>
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <p>{auction.description || 'Lot includes mixed-grade inventory. Inspection available on request. Buyer must arrange pickup within 7 days. Payment via escrow or bank transfer.'}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          {user?.role === 'buyer' ? (
            <Card>
              <div className="mb-3 text-sm text-gray-700 dark:text-gray-300 font-medium">Place your bid</div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  min={minAllowed}
                  placeholder="Enter bid amount"
                />
                <Button 
                  onClick={handlePlaceBid} 
                  icon={bidding ? Loader2 : Gavel}
                  disabled={bidding}
                >
                  {bidding ? 'Bidding...' : 'Bid'}
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Minimum allowed: ${minAllowed.toLocaleString()}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Bell size={14}/> Get outbid alerts
              </div>
            </Card>
          ) : (
            <Card>
              <div className="mb-3 text-sm text-gray-700 dark:text-gray-300 font-medium">Bidding</div>
              <div className="text-center py-4">
                <div className="text-gray-600 dark:text-gray-400 mb-2">
                  {!user ? (
                    <>
                      <p className="text-sm">Please log in to place bids</p>
                      <p className="text-xs mt-1">Only buyers can participate in auctions</p>
                    </>
                  ) : user.role === 'seller' ? (
                    <>
                      <p className="text-sm">Sellers cannot bid on auctions</p>
                      <p className="text-xs mt-1">Create your own auctions to sell items</p>
                    </>
                  ) : user.role === 'admin' ? (
                    <>
                      <p className="text-sm">Admin accounts cannot place bids</p>
                      <p className="text-xs mt-1">Use a buyer account to participate in auctions</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">Only buyers can place bids</p>
                      <p className="text-xs mt-1">Please use a buyer account to participate</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}
          <Card>
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Seller</div>
            <button
              type="button"
              onClick={() => setShowSellerModal(true)}
              className="text-left text-sm text-gray-800 dark:text-gray-200 font-medium hover:underline"
              title="View seller details"
            >
              {sellerName}
            </button>
            {sellerEmail && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{sellerEmail}</div>
            )}
            {/* Public seller details */}
            {seller.profile && (
              <div className="mt-3 space-y-1 text-xs text-gray-700 dark:text-gray-300">
                {seller.profile.companyName && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Company: </span>
                    <span className="text-gray-800 dark:text-gray-200">{seller.profile.companyName}</span>
                  </div>
                )}
                {seller.profile.phone && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Phone: </span>
                    <span className="text-gray-800 dark:text-gray-200">{seller.profile.phone}</span>
                  </div>
                )}
                {seller.profile.companyAddress && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Address: </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {seller.profile.companyAddress.street}
                      {seller.profile.companyAddress.city ? `, ${seller.profile.companyAddress.city}` : ''}
                      {seller.profile.companyAddress.state ? `, ${seller.profile.companyAddress.state}` : ''}
                      {seller.profile.companyAddress.zipCode ? `, ${seller.profile.companyAddress.zipCode}` : ''}
                      {seller.profile.companyAddress.country ? `, ${seller.profile.companyAddress.country}` : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">Verified business • {auction.location}</div>
          </Card>
          {showSellerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowSellerModal(false)}></div>
              <div className="relative mx-4 w-full max-w-3xl rounded-2xl bg-white p-0 shadow-xl dark:bg-gray-800">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Seller Details</h3>
                  <button onClick={() => setShowSellerModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid gap-6 p-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-3">
                    <div className="text-sm"><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{sellerName}</span></div>
                    {sellerEmail && (
                      <div className="text-sm"><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="text-gray-900 dark:text-gray-100">{sellerEmail}</span></div>
                    )}
                    {seller.profile?.phone && (
                      <div className="text-sm"><span className="text-gray-500 dark:text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-gray-100">{seller.profile.phone}</span></div>
                    )}
                    {(seller.profile?.companyAddress || seller.profile?.address) && (
                      <div className="text-sm">
                        <div className="text-gray-500 dark:text-gray-400">Address:</div>
                        <div className="text-gray-900 dark:text-gray-100">
                          {(() => {
                            const addr = seller.profile?.companyAddress || seller.profile?.address
                            if (!addr) return null
                            const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean)
                            return parts.join(', ')
                          })()}
                        </div>
                      </div>
                    )}
                    {seller.profile?.companyName && (
                      <div className="text-sm"><span className="text-gray-500 dark:text-gray-400">Company:</span> <span className="text-gray-900 dark:text-gray-100">{seller.profile.companyName}</span></div>
                    )}
                    {seller.profile?.tradeLicense && (
                      <div className="text-sm"><span className="text-gray-500 dark:text-gray-400">Trade License:</span> <span className="text-gray-900 dark:text-gray-100">{seller.profile.tradeLicense}</span></div>
                    )}
                    <div className="mt-6 flex gap-3">
                      {sellerEmail && (
                        <a href={`mailto:${sellerEmail}`} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-black dark:bg-white dark:text-gray-900">
                          <Mail className="h-4 w-4" /> Email
                        </a>
                      )}
                      {seller.profile?.phone && (
                        <a href={`tel:${seller.profile.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                          <Phone className="h-4 w-4" /> Call
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-56 w-56 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
                      {seller.profile?.avatar ? (
                        <img src={seller.profile.avatar} alt={sellerName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
