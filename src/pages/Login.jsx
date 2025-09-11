import React, { useState } from 'react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUser }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const submit = (e) => {
    e.preventDefault()
    // TODO: POST /auth/login
    setUser({ name: email.split('@')[0] || 'User' })
    nav('/')
  }
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid min-h-[60vh] place-items-center py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-1 text-2xl font-semibold dark:text-white">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Use your business email. You can enable 2FA later in settings.</p>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Password" type="password" value={pass} onChange={setPass} />
          <Button className="w-full" type="submit">Login</Button>
        </form>
      </Card>
    </div>
  )
}
