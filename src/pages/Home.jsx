import React, { useState } from 'react'
import ReelList from '../components/ReelList'
import UploadModal from '../components/UploadModal'
import CommentModal from '../components/CommentModal'


export default function Home(){
const [uploadOpen, setUploadOpen] = useState(false)
const [commentReel, setCommentReel] = useState(null)


return (
<div className="max-w-3xl mx-auto">
<button onClick={()=>setUploadOpen(true)} className="hidden">Open upload (header shows button)</button>
<ReelList onOpenComments={(r)=>setCommentReel(r)} />
{uploadOpen && <UploadModal onClose={()=>setUploadOpen(false)} onUploaded={()=>{}} />}
{commentReel && <CommentModal reel={commentReel} onClose={()=>setCommentReel(null)} onCommentAdded={()=>{}} />}
</div>
)
}