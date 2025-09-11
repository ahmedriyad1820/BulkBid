import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} BulkBid. All rights reserved.</p>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/help" className="hover:underline">Help</Link>
        </div>
      </div>
    </footer>
  )
}
