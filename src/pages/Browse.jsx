import React, { useMemo, useState } from 'react'
import Dropdown from '../components/Dropdown.jsx'
import Card from '../components/ui/Card.jsx'
import AuctionGrid from '../components/AuctionGrid.jsx'
import { Search } from 'lucide-react'
import { AUCTIONS, CATS, LOCS } from '../data/mockData.js'

export default function Browse() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [loc, setLoc] = useState('All')
  const [sort, setSort] = useState('ending')
  const filtered = useMemo(() => {
    let list = [...AUCTIONS]
    if (q) list = list.filter(a => a.title.toLowerCase().includes(q.toLowerCase()))
    if (cat !== 'All') list = list.filter(a => a.category === cat)
    if (loc !== 'All') list = list.filter(a => a.location === loc)
    if (sort === 'ending') list.sort((a, b) => a.endsAt - b.endsAt)
    if (sort === 'price') list.sort((a, b) => b.currentBid - a.currentBid)
    return list
  }, [q, cat, loc, sort])

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
      <AuctionGrid auctions={filtered} />
    </div>
  )
}
