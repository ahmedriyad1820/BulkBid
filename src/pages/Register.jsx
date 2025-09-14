import React, { useState } from 'react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Select from '../components/Select.jsx'
import Uploader from '../components/Uploader.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import { User, Building2, Loader2 } from 'lucide-react'

export default function Register({ setUser }) {
  const nav = useNavigate()
  const [role, setRole] = useState('buyer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Common fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
  
  const handleAvatarChange = (files) => {
    setAvatar(files)
  }
  
  const handleNidDocumentChange = (files) => {
    setNidDocument(files)
  }
  
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Validate required fields
      if (!name || !email || !password || !phone || !nidNumber || !address || !city || !state || !zipCode || !country) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }
      
      if (avatar.length === 0 || nidDocument.length === 0) {
        setError('Please upload both profile photo and NID document')
        setLoading(false)
        return
      }
      
      if (role === 'seller') {
        if (!companyName || !tradeLicense || !companyAddress || !companyCity || !companyState || !companyZipCode || !companyCountry) {
          setError('Please fill in all company details for seller registration')
          setLoading(false)
          return
        }
      }
      
      // Convert images to base64
      const avatarBase64 = await convertToBase64(avatar[0])
      const nidBase64 = await convertToBase64(nidDocument[0])
      
      const userData = {
        name,
        email,
        password,
        role,
        profile: {
          phone,
          nidNumber,
          nidDocument: nidBase64,
          avatar: avatarBase64,
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
      if (role === 'seller') {
        userData.profile.companyName = companyName
        userData.profile.tradeLicense = tradeLicense
        userData.profile.companyAddress = {
          street: companyAddress,
          city: companyCity,
          state: companyState,
          zipCode: companyZipCode,
          country: companyCountry
        }
      }
      
      const response = await api.register(userData)
      setUser(response.user)
      
      // Clear admin state when regular user registers
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('adminEmail')
      
      nav('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to convert file to base64'))
      reader.readAsDataURL(file)
    })
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">Create Your Account</h1>
          <p className="text-gray-600 dark:text-gray-300">Join BulkBid as a buyer or seller</p>
        </div>
        
        <Card className="p-8">
          <form onSubmit={submit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    role === 'buyer'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <User className="w-6 h-6 mb-2 text-blue-500" />
                  <h3 className="font-semibold">Buyer</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Bid on auctions and purchase bulk items</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    role === 'seller'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Building2 className="w-6 h-6 mb-2 text-blue-500" />
                  <h3 className="font-semibold">Seller</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Create auctions and sell bulk inventory</p>
                </button>
              </div>
            </div>
            
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
                required 
              />
              <Input 
                label="Password" 
                type="password"
                value={password} 
                onChange={setPassword} 
                placeholder="Create a strong password"
                required 
              />
              <Input 
                label="Phone Number" 
                value={phone} 
                onChange={setPhone} 
                placeholder="Enter your phone number"
                required 
              />
            </div>
            
            {/* NID Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
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
            {role === 'seller' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Information</h3>
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
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Company Address</h4>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Uploader 
                    onImagesChange={handleAvatarChange} 
                    maxImages={1}
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload your profile photo</p>
                </div>
                <div>
                  <Uploader 
                    onImagesChange={handleNidDocumentChange} 
                    maxImages={1}
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload your NID document</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                `Create ${role === 'buyer' ? 'Buyer' : 'Seller'} Account`
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
