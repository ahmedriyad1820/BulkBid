import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import Uploader from '../components/Uploader.jsx'
import { CATS, LOCS } from '../data/mockData.js'
import { Gavel, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createAuction } from '../services/api.js'

export default function SellCreate() {
  const [form, setForm] = useState({ 
    title: '', 
    description: '',
    category: CATS[0], 
    location: LOCS[0], 
    quantity: 1000, 
    unit: 'kg', 
    grade: 'A', 
    condition: 'Good',
    startingBid: 1000, 
    reservePrice: 2000, 
    durationMin: 60 
  })
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const nav = useNavigate()

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to create an auction.')
      nav('/login')
    } else {
      setIsLoading(false)
    }
  }, [nav])

  const handleImagesChange = (files) => {
    setImages(files)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to create an auction.')
        nav('/login')
        return
      }

      // Validate required fields
      if (!form.title || form.title.length < 5) {
        alert('Title must be at least 5 characters long.')
        setIsSubmitting(false)
        return
      }

      if (!form.description || form.description.length < 10) {
        alert('Description must be at least 10 characters long.')
        setIsSubmitting(false)
        return
      }

      // Validate that at least one image is selected
      if (!images || images.length === 0) {
        alert('Please add at least one image to your auction.')
        setIsSubmitting(false)
        return
      }

      console.log('Processing images:', images.length, 'files')

      // Convert images to base64 for now (in production, upload to cloud storage)
      let imageDataUrls = []
      if (images.length > 0) {
        console.log('Converting images to base64...')
        const imagePromises = images.map((file, index) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              console.log(`Image ${index + 1} converted successfully`)
              resolve(reader.result)
            }
            reader.onerror = () => {
              console.error(`Error converting image ${index + 1}`)
              reject(new Error(`Failed to convert image ${index + 1}`))
            }
            reader.readAsDataURL(file)
          })
        })

        try {
          imageDataUrls = await Promise.all(imagePromises)
          console.log('All images converted successfully:', imageDataUrls.length)
        } catch (imageError) {
          console.error('Error converting images:', imageError)
          alert('Error processing images. Please try again.')
          setIsSubmitting(false)
          return
        }
      } else {
        console.log('No images to process')
      }

      // Calculate end time
      const endTime = new Date()
      endTime.setMinutes(endTime.getMinutes() + form.durationMin)

      const auctionData = {
        ...form,
        images: imageDataUrls,
        endTime: endTime.toISOString(),
        status: 'active'
      }

      console.log('Creating auction with data:', {
        ...auctionData,
        images: `${imageDataUrls.length} images`
      })

      const response = await createAuction(auctionData)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Auction created successfully:', responseData)
        alert('Auction created successfully!')
        nav('/browse')
      } else {
        const errorData = await response.json()
        console.error('Auction creation error:', errorData)
        const firstValidationMsg = Array.isArray(errorData.errors) && errorData.errors.length > 0 
          ? errorData.errors[0].msg 
          : null
        alert(`Error: ${firstValidationMsg || errorData.message || 'Failed to create auction'}`)
      }
    } catch (error) {
      console.error('Error creating auction:', error)
      
      // More specific error handling
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        alert('Please log in to create an auction.')
        nav('/login')
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        alert('You do not have permission to create auctions.')
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        alert('Please check your form data and try again.')
      } else {
        alert(`Error creating auction: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
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
            <Input label="Title" value={form.title} onChange={(v)=>setForm({...form,title:v})} placeholder="eg. Textile fabric rolls – 5 tons" required />
            <Input 
              label="Description" 
              value={form.description} 
              onChange={(v)=>setForm({...form,description:v})} 
              placeholder="Describe your items in detail..." 
              type="textarea"
              required 
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Category" options={CATS} value={form.category} onChange={(v)=>setForm({...form,category:v})} />
              <Select label="Location" options={LOCS} value={form.location} onChange={(v)=>setForm({...form,location:v})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Quantity" type="number" value={form.quantity} onChange={(v)=>setForm({...form,quantity:Number(v)})} required />
              <Select 
                label="Unit" 
                options={['pieces','boxes','pallets','kg','lbs','units']} 
                value={form.unit} 
                onChange={(v)=>setForm({...form,unit:v})} 
              />
              <Select label="Grade" options={['A','B','C','D','Mixed']} value={form.grade} onChange={(v)=>setForm({...form,grade:v})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Condition" options={['New','Like New','Good','Fair','Poor']} value={form.condition} onChange={(v)=>setForm({...form,condition:v})} />
              <Input label="Duration (minutes)" type="number" value={form.durationMin} onChange={(v)=>setForm({...form,durationMin:Number(v)})} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Starting Bid ($)" type="number" value={form.startingBid} onChange={(v)=>setForm({...form,startingBid:Number(v)})} required />
              <Input label="Reserve Price ($)" type="number" value={form.reservePrice} onChange={(v)=>setForm({...form,reservePrice:Number(v)})} />
            </div>
            <div>
              <Uploader onImagesChange={handleImagesChange} maxImages={5} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="text-sm text-gray-600">{form.title || 'Your great auction title'}</div>
            <div className="text-xs text-gray-500">{form.category} • {form.location}</div>
            <div className="text-sm">Qty {form.quantity} {form.unit} • Grade {form.grade} • {form.condition}</div>
            <div className="text-sm">Starting ${form.startingBid} • Reserve ${form.reservePrice || 'None'}</div>
            <div className="text-sm">Duration: {form.durationMin} minutes</div>
            {images.length > 0 ? (
              <div className="text-sm text-green-600">
                {images.length} image{images.length !== 1 ? 's' : ''} selected
              </div>
            ) : (
              <div className="text-sm text-red-600">
                ⚠️ At least 1 image required
              </div>
            )}
            <Button 
              type="submit" 
              icon={isSubmitting ? Loader2 : Gavel} 
              className="w-full"
              disabled={isSubmitting || !form.title || !form.description || images.length === 0}
            >
              {isSubmitting ? 'Processing Images & Creating...' : 'Publish Auction'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
