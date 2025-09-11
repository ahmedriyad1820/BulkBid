import React from 'react'
import Card from '../components/ui/Card.jsx'

export default function StaticPage({ title, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="mb-4 text-2xl font-semibold dark:text-white">{title}</h1>
      <Card className="prose max-w-none">
        <div className="p-4 text-sm text-gray-700 dark:text-gray-300">{children}</div>
      </Card>
    </div>
  )
}
