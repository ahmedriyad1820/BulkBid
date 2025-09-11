import React from 'react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { AUCTIONS } from '../data/mockData.js'

export default function Admin() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-gray-600">Moderate auctions, verify sellers, and review disputes.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Seller Verifications</h3>
            <button className="rounded-xl px-3 py-2 text-sm hover:bg-gray-100">View all</button>
          </div>
          <ul className="space-y-3 text-sm">
            {['AgroTrade Ltd','Dhaka Surplus Co','Ecom Hub'].map((s,i)=>(
              <li key={i} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="font-medium">{s}</div>
                  <div className="text-xs text-gray-500">Tax ID: {100000+i}</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">Reject</button>
                  <button className="rounded-2xl bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-800">Approve</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Flagged Auctions</h3>
            <button className="rounded-xl px-3 py-2 text-sm hover:bg-gray-100">View all</button>
          </div>
          <ul className="space-y-3 text-sm">
            {AUCTIONS.slice(0,3).map(a => (
              <li key={a.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-gray-500">Reason: misleading images</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">Suspend</button>
                  <button className="rounded-2xl bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-800">Clear</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
