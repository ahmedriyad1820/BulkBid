import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Countdown from '../components/Countdown.jsx'
import { Gavel, Clock, Store, Tag, Layers, Bell } from 'lucide-react'
import { AUCTIONS } from '../data/mockData.js'

export default function AuctionDetail() {
  const { id } = useParams()
  const a0 = AUCTIONS.find(x => x.id === id) || AUCTIONS[0]
  const [a, setA] = useState(a0)
  const [amount, setAmount] = useState(a0.currentBid + a0.bidIncrement)
  const minAllowed = Math.max(a.startPrice, a.currentBid + a.bidIncrement)

  useEffect(() => {
    const t = setInterval(() => {
      setA(prev => {
        if (Date.now() > prev.endsAt) return prev
        if (Math.random() < 0.35) {
          const next = { ...prev, currentBid: prev.currentBid + prev.bidIncrement, bidCount: prev.bidCount + 1 }
          return next
        }
        return prev
      })
    }, 2500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => setAmount(minAllowed), [a.currentBid])

  const placeBid = () => {
    if (amount < minAllowed) return alert(`Bid must be ≥ $${minAllowed}`)
    // TODO: POST /auctions/:id/bids
    setA(prev => ({ ...prev, currentBid: amount, bidCount: prev.bidCount + 1 }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {a.images && a.images.length > 0 ? (
              <img src={a.images[0]} alt={a.title} className="max-h-[420px] w-full object-cover" />
            ) : (
              <div className="max-h-[420px] w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-lg">No Image Available</span>
              </div>
            )}
            <div className="mt-4 space-y-2 p-2 sm:p-4">
              <h1 className="text-2xl font-semibold">{a.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <Badge><Store className="mr-1 inline" size={14} /> {a.seller}</Badge>
                <Badge><Tag className="mr-1 inline" size={14} /> {a.category}</Badge>
                <Badge><Layers className="mr-1 inline" size={14} /> Grade {a.grade}</Badge>
                <Badge>{a.location}</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Card>
                  <div className="text-xs text-gray-500">Current Bid</div>
                  <div className="text-2xl font-semibold">${a.currentBid.toLocaleString()}</div>
                </Card>
                <Card>
                  <div className="text-xs text-gray-500">Bids</div>
                  <div className="text-2xl font-semibold">{a.bidCount}</div>
                </Card>
                <Card>
                  <div className="text-xs text-gray-500">Time Left</div>
                  <div className="text-2xl font-semibold"><Countdown endsAt={a.endsAt} /></div>
                </Card>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Card>
                  <div className="text-sm text-gray-600">Quantity</div>
                  <div className="text-lg font-medium">{a.quantity.toLocaleString()} {a.unit}</div>
                </Card>
                <Card>
                  <div className="text-sm text-gray-600">Reserve</div>
                  <div className="text-lg font-medium">${a.reservePrice.toLocaleString()}</div>
                </Card>
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <p>Lot includes mixed-grade inventory. Inspection available on request. Buyer must arrange pickup within 7 days. Payment via escrow or bank transfer.</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <div className="mb-3 text-sm text-gray-600">Place your bid</div>
            <div className="flex items-center gap-2">
              <input type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="w-full rounded-xl border px-3 py-2" />
              <Button onClick={placeBid} icon={Gavel}>Bid</Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">Minimum allowed: ${minAllowed.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
              <Bell size={14}/> Get outbid alerts
            </div>
          </Card>
          <Card>
            <div className="mb-2 text-sm font-medium">Seller</div>
            <div className="text-sm text-gray-700">{a.seller}</div>
            <div className="mt-3 text-xs text-gray-500">Verified business • {a.location}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
