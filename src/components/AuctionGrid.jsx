import React from 'react'
import AuctionCard from './AuctionCard.jsx'

export default function AuctionGrid({ auctions }) {
  if (!auctions.length) return <div className="py-10 text-center text-gray-600">No auctions match your filters.</div>
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map(a => <AuctionCard key={a.id} a={a} />)}
    </div>
  )
}
