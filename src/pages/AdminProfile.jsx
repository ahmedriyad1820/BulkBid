import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Uploader from '../components/Uploader.jsx'
import { useNavigate } from 'react-router-dom'
import { User, Shield, Edit3, Save, X, Phone, MapPin, Mail, FileText, Loader2 } from 'lucide-react'
import api from '../services/api.js'

export default function AdminProfile({ setUser: updateUser, setAdminData }) {
  const nav = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [avatar, setAvatar] = useState([])

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      setError('Admin authentication required. Please login as admin.')
      setLoading(false)
      return
    }
    
    fetchAdminProfile()
  }, [])

  const fetchAdminProfile = async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const response = await Promise.race([
        api.getAdminProfile(),
        timeoutPromise
      ])
      
      const adminData = response.admin || response
      
      // Ensure admin data has required fields
      if (!adminData) {
        throw new Error('No admin data received')
      }
      
      setAdmin(adminData)
      
      // Populate form fields with fallbacks
      setName(adminData.name || 'Admin User')
      setEmail(adminData.email || 'dracula@gmail.com')
      setPhone(adminData.profile?.phone || '')
      setAddress(adminData.profile?.address?.street || '')
      setCity(adminData.profile?.address?.city || '')
      setState(adminData.profile?.address?.state || '')
      setZipCode(adminData.profile?.address?.zipCode || '')
      setCountry(adminData.profile?.address?.country || '')
      
      // Update parent component
      if (updateUser) {
        updateUser(adminData)
      }
      if (setAdminData) {
        setAdminData(adminData)
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err)
      console.error('Error details:', err.message)
      setError('Failed to load admin profile: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleAvatarChange = async (files) => {
    try {
      console.log('Avatar files received:', files)
      const base64Files = await Promise.all(files.map(convertToBase64))
      console.log('Avatar files converted to base64:', base64Files)
      setAvatar(base64Files)
    } catch (err) {
      console.error('Error converting avatar files:', err)
      setError('Failed to process avatar files')
    }
  }


  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const profileData = {
        name,
        email,
        phone,
        address: {
          street: address,
          city,
          state,
          zipCode,
          country
        },
        avatar: avatar.length > 0 ? avatar[0] : admin.profile?.avatar
      }

      console.log('Saving profile data:', profileData)
      console.log('Avatar state:', avatar)
      console.log('Current admin avatar:', admin.profile?.avatar)

      const response = await api.updateAdminProfile(profileData)
      
      setAdmin(response.admin || response)
      setEditing(false)
      setSuccess('Profile updated successfully!')
      
      // Update parent component
      if (updateUser) {
        updateUser(response.admin || response)
      }
      if (setAdminData) {
        setAdminData(response.admin || response)
      }
    } catch (err) {
      console.error('Error updating admin profile:', err)
      console.error('Error details:', err.message)
      setError(err.message || err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setError('')
    setSuccess('')
    
    // Reset form to original values
    setName(admin?.name || '')
    setEmail(admin?.email || '')
    setPhone(admin?.profile?.phone || '')
    setAddress(admin?.profile?.address?.street || '')
    setCity(admin?.profile?.address?.city || '')
    setState(admin?.profile?.address?.state || '')
    setZipCode(admin?.profile?.address?.zipCode || '')
    setCountry(admin?.profile?.address?.country || '')
    setAvatar([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading admin profile...</p>
          {error && (
            <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Admin profile not found</p>
          <div className="flex gap-3 mt-4 justify-center">
            <Button onClick={() => nav('/admin')} className="mt-4">
              Back to Admin Panel
            </Button>
            <Button onClick={() => nav('/login')} variant="outline" className="mt-4">
              Admin Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
              </div>
              <div className="flex gap-3">
                {!editing ? (
                  <Button onClick={() => setEditing(true)} icon={Edit3}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave} 
                      disabled={saving}
                      icon={saving ? Loader2 : Save}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      onClick={handleCancel} 
                      variant="outline"
                      icon={X}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="p-8">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {admin.profile?.avatar ? (
                      <img 
                        src={admin.profile.avatar} 
                        alt="Admin Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold dark:text-white mb-2">{admin.name || 'Admin User'}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{admin.email || 'dracula@gmail.com'}</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium capitalize">Admin</span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 text-base">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{admin.profile?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start gap-4 text-base">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="text-gray-600 dark:text-gray-300">
                      {admin.profile?.address ? (
                        <div>
                          <div>{admin.profile.address.street}</div>
                          <div>{admin.profile.address.city}, {admin.profile.address.state}</div>
                          <div>{admin.profile.address.zipCode}, {admin.profile.address.country}</div>
                        </div>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold dark:text-white mb-6">Profile Information</h3>
                
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!editing}
                        placeholder="Enter your full name"
                        className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editing}
                        placeholder="Enter your email"
                        className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!editing}
                        placeholder="Enter your phone number"
                        className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Address Information</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter street address"
                          className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter city"
                          className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter state"
                          className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter ZIP code"
                          className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter country"
                          className={`w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {editing && (
                    <div className="mt-8 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Profile Photo
                        </label>
                        <Uploader
                          key={`avatar-${editing}`}
                          onImagesChange={handleAvatarChange}
                          maxImages={1}
                        />
                        {admin.profile?.avatar && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Current: {admin.profile.avatar.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                      
                    </div>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
