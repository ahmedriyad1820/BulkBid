import React from 'react'
import { Link } from 'react-router-dom'
import Card from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'
import Countdown from './Countdown.jsx'
import { Gavel, Clock, Layers } from 'lucide-react'

export default function AuctionCard({ a }) {
  // Handle different data formats from mock data vs API
  // Show starting bid if no bids have been placed yet
  const currentBid = (a.currentBid && a.currentBid > 0) ? a.currentBid : (a.startingBid || 0)
  const endTime = a.endsAt || a.endTime
  const bidCount = a.bidCount || 0
  const grade = a.grade || 'N/A'
  const quantity = a.quantity || 0
  const unit = a.unit || 'units'
  const images = a.images || (a.image ? [a.image] : [])
  
  return (
    <Card>
      <Link to={`/auction/${a._id || a.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl">
          {images && images.length > 0 ? (
            <img src={images[0]} alt={a.title} className="h-44 w-full object-cover transition group-hover:scale-105" />
          ) : (
            <div className="h-44 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute right-2 top-2 flex gap-2">
            <Badge>{a.category}</Badge>
            <Badge className="bg-white dark:bg-gray-700 dark:text-gray-300">{a.location}</Badge>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <h3 className="line-clamp-1 text-base font-semibold dark:text-white">{a.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Gavel size={16}/>
              <span>
                {bidCount > 0 ? `$${currentBid.toLocaleString()}` : `Starting at $${currentBid.toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center gap-2"><Clock size={16}/><Countdown endsAt={endTime} /></div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{bidCount} bids</span>
            <span>•</span>
            <span>Grade {grade}</span>
            <span>•</span>
            <span>{quantity.toLocaleString()} {unit}</span>
          </div>
        </div>
      </Link>
    </Card>
  )
}
