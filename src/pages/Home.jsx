import React from 'react'
import Card from '../components/ui/Card.jsx'
import Stat from '../components/ui/Stat.jsx'
import AuctionGrid from '../components/AuctionGrid.jsx'
import { Gavel, ShieldCheck, BarChart3 } from 'lucide-react'
import { AUCTIONS } from '../data/mockData.js'
import Hero from './parts/Hero.jsx'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold dark:text-white">Ending Soon</h2>
            <Link to="/browse" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">View all</Link>
          </div>
          <AuctionGrid auctions={AUCTIONS.slice(0, 8)} />
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <Card><Stat label="Active Auctions" value="128" icon={Gavel} /></Card>
          <Card><Stat label="Verified Sellers" value="42" icon={ShieldCheck} /></Card>
          <Card><Stat label="Bids Today" value="3,219" icon={BarChart3} /></Card>
        </section>
      </div>
    </>
  )
}
