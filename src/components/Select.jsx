import React from 'react'

export default function Select({ label, options, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-gray-700 dark:text-gray-300">{label}</span>
      <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
