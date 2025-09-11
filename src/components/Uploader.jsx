import React, { useState } from 'react'
import Button from './ui/Button.jsx'
import { ImagePlus, Trash2 } from 'lucide-react'

export default function Uploader() {
  const [files, setFiles] = useState([])
  return (
    <div className="rounded-xl border p-3">
      <div className="mb-2 text-sm font-medium">Images</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" icon={ImagePlus} onClick={()=>setFiles([...(files||[]), { name: `photo_${files.length+1}.jpg` }])}>Add Image</Button>
        <div className="text-xs text-gray-500">(Demo: click to add mock files)</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {files.map((f,i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-2 text-xs">
            <span>{f.name}</span>
            <button className="text-gray-500 hover:text-red-600"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  )
}
