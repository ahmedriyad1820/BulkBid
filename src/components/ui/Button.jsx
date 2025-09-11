import React from 'react'

export default function Button({ children, icon: Icon, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition'
  const styles =
    variant === 'primary' ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' :
    variant === 'ghost'   ? 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800' :
    variant === 'outline' ? 'border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700' :
    'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
