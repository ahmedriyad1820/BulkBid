import React from 'react'

export default function Badge({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-100 bg-white/70 dark:bg-gray-800/70 backdrop-blur border-gray-300 dark:border-gray-600 ${className}`}>{children}</span>
}
