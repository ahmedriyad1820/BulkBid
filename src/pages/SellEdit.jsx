import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import Uploader from '../components/Uploader.jsx'
import { CATS, LOCS } from '../data/mockData.js'
import { Loader2, Save } from 'lucide-react'
import { getAuction, updateAuction } from '../services/api.js'

export default function SellEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [auction, setAuction] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATS[0],
    location: LOCS[0],
    quantity: 0,
    unit: 'kg',
    grade: 'A',
    condition: 'Good',
    startingBid: 0,
    reservePrice: 0,
  })
  const [images, setImages] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAuction(id)
        setAuction(data)
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || CATS[0],
          location: data.location || LOCS[0],
          quantity: data.quantity || 0,
          unit: data.unit || 'kg',
          grade: data.grade || 'A',
          condition: data.condition || 'Good',
          startingBid: data.startingBid ?? data.currentBid ?? 0,
          reservePrice: data.reservePrice || 0,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleImagesChange = (files) => setImages(files)

  const convertFilesToBase64 = async (files) => {
    const promises = Array.from(files).map(file => new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result)
      r.onerror = () => reject(new Error('Failed to read image'))
      r.readAsDataURL(file)
    }))
    return Promise.all(promises)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!auction) return
    if (auction.bids && auction.bids.length > 0) {
      alert('This auction already has bids and cannot be edited.')
      return
    }

    try {
      setSaving(true)
      let imagesPayload
      if (images.length > 0) {
        imagesPayload = await convertFilesToBase64(images)
      }

      const payload = {
        ...form,
        ...(imagesPayload ? { images: imagesPayload } : {}),
      }
      const updated = await updateAuction(id, payload)
      alert(updated.message || 'Auction updated')
      nav('/dashboard')
    } catch (err) {
      alert(err.message || 'Failed to update auction')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">Auction not found.</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Auction</h1>
        <p className="text-gray-600">You can edit details until the first bid is placed.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="grid gap-4">
            <Input label="Title" value={form.title} onChange={(v)=>setForm({...form,title:v})} required />
            <Input label="Description" type="textarea" value={form.description} onChange={(v)=>setForm({...form,description:v})} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Category" options={CATS} value={form.category} onChange={(v)=>setForm({...form,category:v})} />
              <Select label="Location" options={LOCS} value={form.location} onChange={(v)=>setForm({...form,location:v})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Quantity" type="number" value={form.quantity} onChange={(v)=>setForm({...form,quantity:Number(v)})} />
              <Input label="Unit" value={form.unit} onChange={(v)=>setForm({...form,unit:v})} />
              <Select label="Grade" options={['A','B','C','D','Mixed']} value={form.grade} onChange={(v)=>setForm({...form,grade:v})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Condition" options={['New','Like New','Good','Fair','Poor']} value={form.condition} onChange={(v)=>setForm({...form,condition:v})} />
              <Input label="Starting Bid ($)" type="number" value={form.startingBid} onChange={(v)=>setForm({...form,startingBid:Number(v)})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Reserve Price ($)" type="number" value={form.reservePrice} onChange={(v)=>setForm({...form,reservePrice:Number(v)})} />
              <div>
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Images</span>
                <Uploader onImagesChange={handleImagesChange} maxImages={5} />
                <div className="mt-2 text-xs text-gray-500">Leave blank to keep existing images.</div>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">{form.title}</div>
            <div className="text-xs text-gray-500">{form.category} • {form.location}</div>
            <div className="text-sm">Qty {form.quantity} {form.unit} • Grade {form.grade}</div>
            <div className="text-sm">Starting ${form.startingBid} • Reserve ${form.reservePrice || 'None'}</div>
            <Button type="submit" icon={saving ? Loader2 : Save} className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}


