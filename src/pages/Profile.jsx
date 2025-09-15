import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Uploader from '../components/Uploader.jsx'
import { useNavigate } from 'react-router-dom'
import { User, Building2, Edit3, Save, X, Phone, MapPin, Mail, IdCard, FileText, Loader2 } from 'lucide-react'
import api from '../services/api.js'

export default function Profile({ setUser: updateUser }) {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nidNumber, setNidNumber] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [avatar, setAvatar] = useState([])
  const [nidDocument, setNidDocument] = useState([])
  
  // Seller specific fields
  const [companyName, setCompanyName] = useState('')
  const [tradeLicense, setTradeLicense] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyCity, setCompanyCity] = useState('')
  const [companyState, setCompanyState] = useState('')
  const [companyZipCode, setCompanyZipCode] = useState('')
  const [companyCountry, setCompanyCountry] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile()
      const userData = response.user || response
      setUser(userData)
      
      // Update user data in App component
      if (updateUser) {
        updateUser(userData)
      }
      
      // Populate form fields
      setName(userData.name || '')
      setEmail(userData.email || '')
      setPhone(userData.profile?.phone || '')
      setNidNumber(userData.profile?.nidNumber || '')
      setAddress(userData.profile?.address?.street || '')
      setCity(userData.profile?.address?.city || '')
      setState(userData.profile?.address?.state || '')
      setZipCode(userData.profile?.address?.zipCode || '')
      setCountry(userData.profile?.address?.country || '')
      
      // Seller specific fields
      setCompanyName(userData.profile?.companyName || '')
      setTradeLicense(userData.profile?.tradeLicense || '')
      setCompanyAddress(userData.profile?.companyAddress?.street || '')
      setCompanyCity(userData.profile?.companyAddress?.city || '')
      setCompanyState(userData.profile?.companyAddress?.state || '')
      setCompanyZipCode(userData.profile?.companyAddress?.zipCode || '')
      setCompanyCountry(userData.profile?.companyAddress?.country || '')
      
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (files) => {
    console.log('Avatar files changed:', files.length, 'files')
    setAvatar(files)
  }
  
  const handleNidDocumentChange = (files) => {
    console.log('NID document files changed:', files.length, 'files')
    setNidDocument(files)
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to convert file to base64'))
      reader.readAsDataURL(file)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('Saving profile with avatar files:', avatar.length, 'NID files:', nidDocument.length)
      
      const updateData = {
        name,
        profile: {
          phone,
          nidNumber,
          address: {
            street: address,
            city,
            state,
            zipCode,
            country
          }
        }
      }

      // Add seller specific fields
      if (user?.role === 'seller') {
        updateData.profile.companyName = companyName
        updateData.profile.tradeLicense = tradeLicense
        updateData.profile.companyAddress = {
          street: companyAddress,
          city: companyCity,
          state: companyState,
          zipCode: companyZipCode,
          country: companyCountry
        }
      }

      // Handle file uploads - preserve existing files if no new ones uploaded
      if (avatar.length > 0) {
        console.log('Converting avatar to base64...')
        updateData.profile.avatar = await convertToBase64(avatar[0])
        console.log('Avatar converted successfully')
      } else if (user.profile?.avatar) {
        // Keep existing avatar if no new one uploaded
        console.log('Keeping existing avatar')
        updateData.profile.avatar = user.profile.avatar
      }
      
      if (nidDocument.length > 0) {
        console.log('Converting NID document to base64...')
        updateData.profile.nidDocument = await convertToBase64(nidDocument[0])
        console.log('NID document converted successfully')
      } else if (user.profile?.nidDocument) {
        // Keep existing NID document if no new one uploaded
        console.log('Keeping existing NID document')
        updateData.profile.nidDocument = user.profile.nidDocument
      }

      console.log('Sending update data:', updateData)
      await api.updateProfile(updateData)
      console.log('Profile updated successfully')
      setSuccess('Profile updated successfully!')
      setEditing(false)
      fetchProfile() // Refresh profile data
      
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setError('')
    setSuccess('')
    // Reset file arrays
    setAvatar([])
    setNidDocument([])
    // Reset form to original values
    fetchProfile()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Unable to load your profile information.</p>
          <Button onClick={() => nav('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
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
                    icon={saving ? Loader2 : Save}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    icon={X}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
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
                  {user.profile?.avatar ? (
                    <img 
                      src={user.profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold dark:text-white mb-2">{user.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{user.email}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {user.pendingSeller ? (
                    <Building2 className="w-5 h-5 text-amber-500" />
                  ) : user.role === 'seller' ? (
                    <Building2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <User className="w-5 h-5 text-green-500" />
                  )}
                  {user.pendingSeller ? (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium dark:bg-amber-900 dark:text-amber-300">Pending approval</span>
                  ) : (
                    <span className="text-sm font-medium capitalize">{user.role}</span>
                  )}
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-base">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{user.profile?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-4 text-base">
                  <IdCard className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{user.profile?.nidNumber || 'Not provided'}</span>
                </div>
                <div className="flex items-start gap-4 text-base">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="text-gray-600 dark:text-gray-300">
                    {user.profile?.address ? (
                      <div>
                        <div>{user.profile.address.street}</div>
                        <div>{user.profile.address.city}, {user.profile.address.state}</div>
                        <div>{user.profile.address.zipCode}, {user.profile.address.country}</div>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {editing ? 'Edit Profile Information' : 'Profile Information'}
              </h3>

              {editing ? (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Full Name" 
                      value={name} 
                      onChange={setName} 
                      placeholder="Enter your full name"
                      required 
                    />
                    <Input 
                      label="Email Address" 
                      type="email"
                      value={email} 
                      onChange={setEmail} 
                      placeholder="Enter your email"
                      disabled
                    />
                    <Input 
                      label="Phone Number" 
                      value={phone} 
                      onChange={setPhone} 
                      placeholder="Enter your phone number"
                      required 
                    />
                    <Input 
                      label="NID Number" 
                      value={nidNumber} 
                      onChange={setNidNumber} 
                      placeholder="Enter your NID number"
                      required 
                    />
                  </div>
                  
                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="Street Address" 
                        value={address} 
                        onChange={setAddress} 
                        placeholder="Enter street address"
                        required 
                      />
                      <Input 
                        label="City" 
                        value={city} 
                        onChange={setCity} 
                        placeholder="Enter city"
                        required 
                      />
                      <Input 
                        label="State/Province" 
                        value={state} 
                        onChange={setState} 
                        placeholder="Enter state or province"
                        required 
                      />
                      <Input 
                        label="ZIP/Postal Code" 
                        value={zipCode} 
                        onChange={setZipCode} 
                        placeholder="Enter ZIP or postal code"
                        required 
                      />
                      <Input 
                        label="Country" 
                        value={country} 
                        onChange={setCountry} 
                        placeholder="Enter country"
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Seller Specific Fields */}
                  {user.role === 'seller' && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">Company Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="Company Name" 
                          value={companyName} 
                          onChange={setCompanyName} 
                          placeholder="Enter company name"
                          required 
                        />
                        <Input 
                          label="Trade License Number" 
                          value={tradeLicense} 
                          onChange={setTradeLicense} 
                          placeholder="Enter trade license number"
                          required 
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">Company Address</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input 
                            label="Company Street Address" 
                            value={companyAddress} 
                            onChange={setCompanyAddress} 
                            placeholder="Enter company street address"
                            required 
                          />
                          <Input 
                            label="Company City" 
                            value={companyCity} 
                            onChange={setCompanyCity} 
                            placeholder="Enter company city"
                            required 
                          />
                          <Input 
                            label="Company State/Province" 
                            value={companyState} 
                            onChange={setCompanyState} 
                            placeholder="Enter company state or province"
                            required 
                          />
                          <Input 
                            label="Company ZIP/Postal Code" 
                            value={companyZipCode} 
                            onChange={setCompanyZipCode} 
                            placeholder="Enter company ZIP or postal code"
                            required 
                          />
                          <Input 
                            label="Company Country" 
                            value={companyCountry} 
                            onChange={setCompanyCountry} 
                            placeholder="Enter company country"
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Document Uploads */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Update Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Uploader 
                          key={`avatar-${editing}`}
                          onImagesChange={handleAvatarChange} 
                          maxImages={1}
                        />
                        <p className="text-sm text-gray-500 mt-1">Update profile photo</p>
                      </div>
                      <div>
                        <Uploader 
                          key={`nid-${editing}`}
                          onImagesChange={handleNidDocumentChange} 
                          maxImages={1}
                        />
                        <p className="text-sm text-gray-500 mt-1">Update NID document</p>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Basic Information Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                      <p className="text-gray-900 dark:text-white">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-white">{user.profile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">NID Number</label>
                      <p className="text-gray-900 dark:text-white">{user.profile?.nidNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {/* Address Display */}
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                    <div className="text-gray-900 dark:text-white">
                      {user.profile?.address ? (
                        <div>
                          <div>{user.profile.address.street}</div>
                          <div>{user.profile.address.city}, {user.profile.address.state}</div>
                          <div>{user.profile.address.zipCode}, {user.profile.address.country}</div>
                        </div>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                  
                  {/* Seller Information Display */}
                  {user.role === 'seller' && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">Company Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</label>
                          <p className="text-gray-900 dark:text-white">{user.profile?.companyName || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Trade License</label>
                          <p className="text-gray-900 dark:text-white">{user.profile?.tradeLicense || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Address</label>
                        <div className="text-gray-900 dark:text-white">
                          {user.profile?.companyAddress ? (
                            <div>
                              <div>{user.profile.companyAddress.street}</div>
                              <div>{user.profile.companyAddress.city}, {user.profile.companyAddress.state}</div>
                              <div>{user.profile.companyAddress.zipCode}, {user.profile.companyAddress.country}</div>
                            </div>
                          ) : (
                            'Not provided'
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Documents Display */}
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Profile Photo: {user.profile?.avatar ? 'Uploaded' : 'Not uploaded'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          NID Document: {user.profile?.nidDocument ? 'Uploaded' : 'Not uploaded'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
