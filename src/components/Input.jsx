import React from 'react'

export default function Input({ label, value, onChange, type = 'text', placeholder, required = false }) {
  const inputClasses = "w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
  
  if (type === 'textarea') {
    return (
      <label className="block text-sm">
        <span className="mb-2 block text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <textarea 
          value={value} 
          onChange={(e)=>onChange(e.target.value)} 
          placeholder={placeholder} 
          required={required}
          rows={4}
          className={`${inputClasses} resize-vertical`}
        />
      </label>
    )
  }

  return (
    <label className="block text-sm">
      <span className="mb-2 block text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <input 
        type={type} 
        value={value} 
        onChange={(e)=>onChange(e.target.value)} 
        placeholder={placeholder} 
        required={required}
        className={inputClasses} 
      />
    </label>
  )
}
