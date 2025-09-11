import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2 } from 'lucide-react'

export default function Dropdown({ label, value, setValue, options }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm dark:border-gray-600 dark:bg-gray-800">
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        <span className="font-medium dark:text-white">{value}</span>
        <ChevronDown className="ml-2 dark:text-gray-400" size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="absolute z-20 mt-2 w-full rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-2 shadow">
            {options.map(opt => (
              <button key={opt} onClick={()=>{setValue(opt); setOpen(false);}} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white ${value===opt?'bg-gray-50 dark:bg-gray-700': ''}`}>
                <span>{opt}</span>
                {value===opt && <CheckCircle2 size={16} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
