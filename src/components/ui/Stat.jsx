import React from 'react'

export default function Stat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl border p-2 dark:border-gray-600">{Icon && <Icon size={18} />}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-lg font-semibold dark:text-white">{value}</div>
      </div>
    </div>
  )
}
