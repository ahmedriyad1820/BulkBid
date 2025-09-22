import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

export default function SellerProfile() {
  const location = useLocation()
  const navigate = useNavigate()
  const seller = location.state?.seller || null
  const locationText = location.state?.location || ''

  if (!seller) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Seller not found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Open this page from an auction to view the seller profile.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Seller</h2>
          <div className="mt-2 text-gray-800 dark:text-gray-200 font-medium">{seller.name || 'Unknown Seller'}</div>
          {seller.email && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{seller.email}</div>
          )}
          {locationText && (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">Verified business • {locationText}</div>
          )}
        </Card>
        {seller.profile && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Company</h3>
            {seller.profile.companyName && (
              <div className="text-sm text-gray-800 dark:text-gray-200"><span className="text-gray-500 dark:text-gray-400">Company:</span> {seller.profile.companyName}</div>
            )}
            {seller.profile.tradeLicense && (
              <div className="text-sm text-gray-800 dark:text-gray-200 mt-1"><span className="text-gray-500 dark:text-gray-400">Trade License:</span> {seller.profile.tradeLicense}</div>
            )}
            {seller.profile.companyAddress && (
              <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                <span className="text-gray-500 dark:text-gray-400">Address:</span> {seller.profile.companyAddress.street}, {seller.profile.companyAddress.city}, {seller.profile.companyAddress.state}, {seller.profile.companyAddress.zipCode}, {seller.profile.companyAddress.country}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}


