import React from 'react'
import { Link } from 'react-router-dom'
import Card from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'
import Countdown from './Countdown.jsx'
import { Gavel, Clock, Layers } from 'lucide-react'

export default function AuctionCard({ a }) {
  return (
    <Card>
      <Link to={`/auction/${a.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl">
          {a.images && a.images.length > 0 ? (
            <img src={a.images[0]} alt={a.title} className="h-44 w-full object-cover transition group-hover:scale-105" />
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
            <div className="flex items-center gap-2"><Gavel size={16}/><span>${a.currentBid.toLocaleString()}</span></div>
            <div className="flex items-center gap-2"><Clock size={16}/><Countdown endsAt={a.endsAt} /></div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{a.bidCount} bids</span>
            <span>•</span>
            <span>Grade {a.grade}</span>
            <span>•</span>
            <span>{a.quantity.toLocaleString()} {a.unit}</span>
          </div>
        </div>
      </Link>
    </Card>
  )
}
