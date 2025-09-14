import React, { useState } from 'react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

export default function Register({ setUser }) {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await api.register({ name, email, password: pass })
      setUser(response.user)
      nav('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid min-h-[60vh] place-items-center py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-1 text-2xl font-semibold dark:text-white">Create your account</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Use your business email. You can enable 2FA later in settings.</p>
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Password" type="password" value={pass} onChange={setPass} />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
