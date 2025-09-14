import React, { useState } from 'react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useNavigate } from 'react-router-dom'
import { login, adminLogin } from '../services/api.js'

export default function Login({ setUser, updateAdminState }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Check if admin login (dracula@gmail.com)
      if (email.toLowerCase() === 'dracula@gmail.com') {
        const response = await adminLogin({ email, password: pass })
        if (response.success) {
          // Store admin info in localStorage
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('adminEmail', response.admin.email)
          // Update admin state in App component
          if (updateAdminState) {
            updateAdminState(true, response.admin.email)
          }
          nav('/admin')
          return
        }
      }
      
      // Regular user login
      const response = await login({ email, password: pass })
      setUser(response.user)
      
      // Clear admin state when regular user logs in
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('adminEmail')
      if (updateAdminState) {
        updateAdminState(false, '')
      }
      
      nav('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid min-h-[60vh] place-items-center py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-1 text-2xl font-semibold dark:text-white">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Use your business email. You can enable 2FA later in settings.</p>
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Password" type="password" value={pass} onChange={setPass} />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
