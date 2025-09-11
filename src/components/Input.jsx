import React from 'react'

export default function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-gray-700 dark:text-gray-300">{label}</span>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" />
    </label>
  )
}
