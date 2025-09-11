import React from 'react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Countdown from '../components/Countdown.jsx'
import { AUCTIONS } from '../data/mockData.js'
import { Filter, Plus, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
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
            <h3 className="text-lg font-semibold">Your Bids</h3>
            <Button variant="ghost" icon={Filter}>Filter</Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Auction</th>
                <th>Current</th>
                <th>Ends</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {AUCTIONS.slice(0,6).map(a => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">
                    <Link to={`/auction/${a.id}`} className="font-medium hover:underline">{a.title}</Link>
                    <div className="text-xs text-gray-500">{a.location} • {a.category}</div>
                  </td>
                  <td>${a.currentBid.toLocaleString()}</td>
                  <td><Countdown endsAt={a.endsAt} /></td>
                  <td><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Leading</span></td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  )
}
