import React, { useEffect, useState } from 'react'

export default function Countdown({ endsAt }) {
  // Handle different endTime formats (timestamp vs Date string)
  const getEndTime = () => {
    if (!endsAt) return null
    if (typeof endsAt === 'number') return endsAt
    if (typeof endsAt === 'string') return new Date(endsAt).getTime()
    if (endsAt instanceof Date) return endsAt.getTime()
    return null
  }

  const endTime = getEndTime()
  const [rem, setRem] = useState(endTime ? Math.max(0, endTime - Date.now()) : 0)
  
  useEffect(() => {
    if (!endTime) return
    
    const t = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now())
      setRem(remaining)
    }, 1000)
    
    return () => clearInterval(t)
  }, [endTime])
  
  const s = Math.floor(rem / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  
  // Handle invalid or missing endTime
  if (!endTime || isNaN(endTime) || s < 0) {
    return <span className="font-medium text-gray-500 dark:text-gray-400">--:--</span>
  }
  
  return <span className={`font-medium ${s < 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>{m}:{sec.toString().padStart(2, '0')}</span>
}
