import React from 'react'

export default function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm ${className}`}>{children}</div>
}
