import React, { useState } from 'react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import Uploader from '../components/Uploader.jsx'
import { CATS, LOCS } from '../data/mockData.js'
import { Gavel } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SellCreate() {
  const [form, setForm] = useState({ title: '', category: CATS[0], location: LOCS[0], quantity: 1000, unit: 'kg', grade: 'A', startPrice: 1000, bidIncrement: 50, reservePrice: 2000, durationMin: 60 })
  const nav = useNavigate()
  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: POST /items then /auctions
    alert('Auction created (demo).')
    nav('/browse')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create Auction</h1>
        <p className="text-gray-600">List your bulk lot with photos and schedule the live auction.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="grid gap-4">
            <Input label="Title" value={form.title} onChange={(v)=>setForm({...form,title:v})} placeholder="eg. Textile fabric rolls – 5 tons" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Category" options={CATS} value={form.category} onChange={(v)=>setForm({...form,category:v})} />
              <Select label="Location" options={LOCS} value={form.location} onChange={(v)=>setForm({...form,location:v})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Quantity" type="number" value={form.quantity} onChange={(v)=>setForm({...form,quantity:Number(v)})} />
              <Input label="Unit" value={form.unit} onChange={(v)=>setForm({...form,unit:v})} />
              <Select label="Grade" options={['A','B','C']} value={form.grade} onChange={(v)=>setForm({...form,grade:v})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Start Price ($)" type="number" value={form.startPrice} onChange={(v)=>setForm({...form,startPrice:Number(v)})} />
              <Input label="Bid Increment ($)" type="number" value={form.bidIncrement} onChange={(v)=>setForm({...form,bidIncrement:Number(v)})} />
              <Input label="Reserve Price ($)" type="number" value={form.reservePrice} onChange={(v)=>setForm({...form,reservePrice:Number(v)})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Duration (minutes)" type="number" value={form.durationMin} onChange={(v)=>setForm({...form,durationMin:Number(v)})} />
              <Uploader />
            </div>
          </div>
        </Card>
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="text-sm text-gray-600">{form.title || 'Your great auction title'}</div>
            <div className="text-xs text-gray-500">{form.category} • {form.location}</div>
            <div className="text-sm">Qty {form.quantity} {form.unit} • Grade {form.grade}</div>
            <div className="text-sm">Start ${form.startPrice} • Step ${form.bidIncrement} • Reserve ${form.reservePrice}</div>
            <Button type="submit" icon={Gavel} className="w-full">Publish Auction</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
