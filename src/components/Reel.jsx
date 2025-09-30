import React, { useRef, useState } from 'react'
import useInViewPlay from '../hooks/useInViewPlay'
import { reelsService } from '../services/reelsService'


export default function Reel({ reel, onOpenComments }){
const videoRef = useRef(null)
const [likes, setLikes] = useState(reel.likes)
const [isLiked, setIsLiked] = useState(false)
useInViewPlay(videoRef)


async function handleLike(){
if(isLiked) return
setIsLiked(true); setLikes(l=>l+1)
try { await reelsService.like(reel.id) }
catch(e){ setIsLiked(false); setLikes(l=>l-1) }
}


return (
<div className="h-screen flex items-end justify-start p-4 box-border">
<video
ref={videoRef}
src={reel.src}
loop
playsInline
className="w-full h-full object-cover rounded-xl shadow-lg"
muted
/>
<div className="absolute right-4 bottom-12 flex flex-col items-center gap-4">
<button onClick={handleLike} className="text-center">
<div className={isLiked? 'text-pink-500':'text-white'}>❤</div>
<div className="text-xs">{likes}</div>
</button>
<button onClick={() => onOpenComments(reel)}>
💬
<div className="text-xs">{reel.comments.length}</div>
</button>
</div>
<div className="absolute left-4 bottom-6">
<div className="font-semibold">@{reel.user}</div>
<div className="text-sm opacity-90">{reel.caption}</div>
</div>
</div>
)
}