import React, { useState } from 'react'
import { reelsService } from '../services/reelsService'


export default function UploadModal({ onClose, onUploaded }){
const [file, setFile] = useState(null)
const [caption, setCaption] = useState('')
const [loading, setLoading] = useState(false)


async function handleUpload(){
if(!file) return alert('pick a file')
setLoading(true)
try{
const r = await reelsService.uploadReel({ file, user:'you', caption })
onUploaded(r)
onClose()
}catch(e){ alert('upload failed') }
setLoading(false)
}


return (
<div className="fixed inset-0 flex items-center justify-center bg-black/60">
<div className="bg-gray-800 p-6 rounded max-w-md w-full">
<h3 className="text-lg font-semibold mb-3">Upload Reel</h3>
<input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} />
<input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="caption" className="mt-3 w-full" />
<div className="mt-4 flex justify-end gap-2">
<button onClick={onClose} className="px-3 py-1">Cancel</button>
<button onClick={handleUpload} className="px-3 py-1 bg-white text-black" disabled={loading}>{loading? 'Uploading...':'Upload'}</button>
</div>
</div>
</div>
)
}