import React, { useEffect, useState } from 'react'

export default function Countdown({ endsAt }) {
  const [rem, setRem] = useState(endsAt - Date.now())
  useEffect(() => {
    const t = setInterval(() => setRem(Math.max(0, endsAt - Date.now())), 1000)
    return () => clearInterval(t)
  }, [endsAt])
  const s = Math.floor(rem / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return <span className={`font-medium ${s < 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>{m}:{sec.toString().padStart(2, '0')}</span>
}
