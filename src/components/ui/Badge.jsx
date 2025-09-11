import React from 'react'

export default function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 dark:border-gray-600">{children}</span>
}
