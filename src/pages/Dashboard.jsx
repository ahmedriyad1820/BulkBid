import React, { useEffect, useState } from 'react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Countdown from '../components/Countdown.jsx'
import { Filter, Plus, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProfile, getUserAuctions, getUserBids, getMyOrders } from '../services/api.js'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [sellerAuctions, setSellerAuctions] = useState([])
  const [loadingAuctions, setLoadingAuctions] = useState(false)
  const [buyerBids, setBuyerBids] = useState([])
  const [loadingBids, setLoadingBids] = useState(false)
  const [error, setError] = useState('')
  const [selectedBidder, setSelectedBidder] = useState(null)
  const [creatingOrderFor, setCreatingOrderFor] = useState(null)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [buyerTab, setBuyerTab] = useState('bids') // 'bids' | 'orders'

  // Load current user
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingUser(true)
        const u = await getProfile()
        setUser(u)
        
        // If seller, load their auctions
        if (u?.role === 'seller') {
          setLoadingAuctions(true)
          const auctions = await getUserAuctions()
          // API returns an array
          setSellerAuctions(Array.isArray(auctions) ? auctions : [])
        }
        // If buyer, load their bids
        if (u?.role === 'buyer') {
          setLoadingBids(true)
          const bids = await getUserBids()
          setBuyerBids(Array.isArray(bids) ? bids : [])
          setLoadingOrders(true)
          const o = await getMyOrders()
          setOrders(Array.isArray(o) ? o : [])
        }
      } catch (e) {
        setError(e?.message || 'Failed to load dashboard')
      } finally {
        setLoadingUser(false)
        setLoadingAuctions(false)
        setLoadingBids(false)
        setLoadingOrders(false)
      }
    }
    load()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-600">Track your bids, wins, and sales.</p>
        </div>
        <Link to="/sell"><Button icon={Plus}>New Auction</Button></Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{user?.role === 'seller' ? 'Your Auctions' : (buyerTab === 'orders' ? 'Orders' : 'Your Bids')}</h3>
            {user?.role === 'buyer' ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setBuyerTab('bids')} className={`rounded-full px-3 py-1 text-sm ${buyerTab==='bids' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Bids</button>
                <button onClick={() => setBuyerTab('orders')} className={`rounded-full px-3 py-1 text-sm ${buyerTab==='orders' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Orders</button>
              </div>
            ) : (
            <Button variant="ghost" icon={Filter}>Filter</Button>
            )}
          </div>
          {error && (
            <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
          )}
          {loadingUser || (user?.role === 'seller' && loadingAuctions) || (user?.role === 'buyer' && (buyerTab==='bids' ? loadingBids : loadingOrders)) ? (
            <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">Loading...</div>
          ) : user?.role === 'seller' ? (
            sellerAuctions.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">
                You have not created any auctions yet.
                <div className="mt-3"><Link to="/sell"><Button>Create your first auction</Button></Link></div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Auction</th>
                    <th>Current</th>
                    <th>Ends</th>
                    <th className="pl-8">Status</th>
                    <th className="w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerAuctions.map(a => {
                    const topBid = Array.isArray(a.bids) ? a.bids[0] : null
                    const topBidderName = topBid?.bidder?.name || '—'
                    const topBidAmount = topBid?.amount || (a.currentBid && a.currentBid > 0 ? a.currentBid : 0)
                    return (
                      <tr key={a._id} className="border-t align-top">
                        <td className="py-2">
                          <Link to={`/auction/${a._id}`} className="font-medium hover:underline">{a.title}</Link>
                          <div className="text-xs text-gray-500">{a.location} • {a.category}</div>
                          {/* Bidders compact list */}
                          {Array.isArray(a.bids) && a.bids.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                                Leading: <button onClick={() => setSelectedBidder(topBid?.bidder || null)} className="font-medium text-gray-900 dark:text-white hover:underline">{topBidderName}</button> • ${topBidAmount.toLocaleString()}
                              </div>
                              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                {/* Additional bidder list removed per request */}
                              </div>
                            </div>
                          )}
                        </td>
                        <td>${(a.currentBid && a.currentBid > 0 ? a.currentBid : a.startingBid || 0).toLocaleString()}</td>
                        <td><Countdown endsAt={a.endTime} /></td>
                        <td>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">{a.status}</span>
                        </td>
                        <td className="py-2">
                          {(!a.bids || a.bids.length === 0) ? (
                            <Link to={`/sell/edit/${a._id}`} className="text-blue-600 hover:underline">Edit</Link>
                          ) : (
                            <span className="text-xs text-gray-500">Locked</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          ) : buyerTab === 'bids' ? (
            buyerBids.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">No bids to show yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Auction</th>
                    <th className="text-right">Your Bid</th>
                    <th className="text-right">Leading</th>
                    <th className="text-right pr-8">Ends</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerBids.map(a => {
                    const bids = Array.isArray(a.bids) ? a.bids : []
                    const myTop = bids.find(b => (typeof b.bidder === 'object' ? b.bidder?._id : b.bidder) === user._id) || null
                    // Determine top bid by amount, then latest by timestamp if tie
                    let highest = null
                    if (bids.length > 0) {
                      const maxAmount = Math.max(...bids.map(b => b?.amount || 0))
                      const topAtMax = bids.filter(b => (b?.amount || 0) === maxAmount)
                      highest = topAtMax.reduce((latest, b) => {
                        const bt = new Date(b?.timestamp || b?.time || b?.createdAt || 0).getTime()
                        const lt = new Date(latest?.timestamp || latest?.time || latest?.createdAt || 0).getTime()
                        return bt >= lt ? b : latest
                      }, topAtMax[0])
                    }
                    const highestBidderId = highest ? (typeof highest.bidder === 'object' ? highest.bidder?._id : highest.bidder) : null
                    const isLeading = !!highestBidderId && String(highestBidderId) === String(user._id)
                    const isEnded = (a.status === 'ended') || (a.endTime && new Date(a.endTime) <= new Date())
                    const winnerIdRaw = a && a.winner ? (typeof a.winner === 'object' ? a.winner._id : a.winner) : null
                    const inferredWinnerId = !winnerIdRaw && isEnded ? highestBidderId : null
                    const effectiveWinnerId = winnerIdRaw || inferredWinnerId
                    const isWinner = !!effectiveWinnerId && String(effectiveWinnerId) === String(user._id)
                    const canOrder = isEnded && isWinner
                    return (
                      <tr key={a._id} className="border-t align-top">
                        <td className="py-2">
                          <Link to={`/auction/${a._id}`} className="font-medium hover:underline">{a.title}</Link>
                          <div className="text-xs text-gray-500">{a.location} • {a.category}</div>
                        </td>
                        <td className="text-right align-middle">${(myTop?.amount || 0).toLocaleString()}</td>
                        <td className={`text-right align-middle ${isLeading ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                          {highest ? `$${highest.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="text-right align-middle pr-8">
                          {isEnded ? (
                            <span className={`rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${isWinner ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                              {isWinner ? 'Won' : 'Lost'}
                            </span>
                          ) : (
                            <Countdown endsAt={a.endTime} />
                          )}
                        </td>
                        <td className="align-middle">
                          <div className="flex items-center gap-2 h-10 justify-between w-full">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap">{a.status}</span>
                            <Button 
                              size="sm" 
                              onClick={() => setCreatingOrderFor(a)}
                              disabled={!canOrder}
                              title={canOrder ? 'Create order' : 'You can place the order after you win and the auction ends'}
                              className="whitespace-nowrap"
                            >
                              Place Order
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          ) : (
            orders.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">No orders yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Order</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Status</th>
                    <th className="text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-t align-top">
                      <td className="py-2">
                        <div className="font-medium">{o.auction?.title || 'Auction'}</div>
                        <div className="text-xs text-gray-500">{o.auction?.location}</div>
                      </td>
                      <td className="text-right">${(o.amount || 0).toLocaleString()}</td>
                      <td className="text-right"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap">{o.status}</span></td>
                      <td className="text-right">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="text-xs text-gray-500">Wallet Balance</div>
            <div className="text-2xl font-semibold">$2,450</div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" icon={DollarSign}>Deposit</Button>
              <Button variant="ghost">Withdraw</Button>
            </div>
          </Card>
          <Card>
            <div className="mb-2 text-sm font-medium">Notifications</div>
            <ul className="space-y-2 text-sm">
              <li>Outbid on Lot #11</li>
              <li>Seller approved: AgroTrade Ltd</li>
              <li>Order #9823 paid</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Bidder detail modal */}
      {selectedBidder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedBidder(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 dark:text-gray-100" onClick={(e)=>e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Buyer Details</div>
              <button onClick={() => setSelectedBidder(null)} className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
            </div>
            {/* Avatar + details side-by-side */}
            <div className="mb-4 flex items-start gap-4">
              <div className="space-y-2 text-sm flex-1">
                <div><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium">{selectedBidder.name || '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Email:</span> <span>{selectedBidder.email || '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Phone:</span> <span>{selectedBidder.profile?.phone || '—'}</span></div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Address:</span>
                  <div className="mt-1 text-xs">
                    {selectedBidder.profile?.address ? (
                      <>
                        <div>{selectedBidder.profile.address.street}</div>
                        <div>{selectedBidder.profile.address.city} {selectedBidder.profile.address.state} {selectedBidder.profile.address.zipCode}</div>
                        <div>{selectedBidder.profile.address.country}</div>
                      </>
                    ) : '—'}
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                {selectedBidder.profile?.avatar ? (
                  <img 
                    src={selectedBidder.profile.avatar} 
                    alt={selectedBidder.name || 'Buyer'} 
                    className="h-40 w-40 rounded-lg object-cover border dark:border-gray-700" 
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-lg border bg-gray-100 text-3xl font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {(selectedBidder.name || 'B').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <a href={`mailto:${selectedBidder.email || ''}`} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Email</a>
              {selectedBidder.profile?.phone && (
                <a href={`tel:${selectedBidder.profile.phone}`} className="rounded-xl bg-black px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">Call</a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Order modal */}
      {creatingOrderFor && (
        <CreateOrderModal auction={creatingOrderFor} user={user} onClose={() => setCreatingOrderFor(null)} />
      )}
    </div>
  )
}

function CreateOrderModal({ auction, user, onClose }) {
  const [saving, setSaving] = React.useState(false)
  const [street, setStreet] = React.useState('')
  const [city, setCity] = React.useState('')
  const [state, setState] = React.useState('')
  const [zipCode, setZipCode] = React.useState('')
  const [country, setCountry] = React.useState('')
  const [contactNumber, setContactNumber] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  // Autofill from user profile on open
  React.useEffect(() => {
    const addr = user?.profile?.address
    if (addr) {
      setStreet(addr.street || '')
      setCity(addr.city || '')
      setState(addr.state || '')
      setZipCode(addr.zipCode || '')
      setCountry(addr.country || '')
    }
    setContactNumber(user?.profile?.phone || '')
  }, [user])

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const shippingAddress = { street, city, state, zipCode, country }
      const { createOrder } = await import('../services/api.js')
      await createOrder(auction._id, shippingAddress, contactNumber)
      setSuccess('Order created successfully')
      setTimeout(onClose, 800)
    } catch (e) {
      setError(e?.message || 'Failed to create order')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:text-gray-100" onClick={(e)=>e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Create Order</div>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">{auction.title} • Total ${auction.currentBid?.toLocaleString() || 0}</div>
        {error && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
        {success && <div className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">{success}</div>}
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-2" placeholder="Contact Number" value={contactNumber} onChange={e=>setContactNumber(e.target.value)} />
          <input className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="Street" value={street} onChange={e=>setStreet(e.target.value)} />
          <input className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
          <input className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="State" value={state} onChange={e=>setState(e.target.value)} />
          <input className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="ZIP" value={zipCode} onChange={e=>setZipCode(e.target.value)} />
          <input className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-2" placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200">{saving ? 'Creating…' : 'Create Order'}</button>
        </div>
      </div>
    </div>
  )
}
