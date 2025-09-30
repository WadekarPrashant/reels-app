import React, { useEffect, useRef, useState, useCallback } from 'react'
import Reel from './Reel'
import { reelsService } from '../services/reelsService'


export default function ReelList({ onOpenComments }){
const [reels, setReels] = useState([])
const [loading, setLoading] = useState(false)
const containerRef = useRef(null)


useEffect(()=>{ loadMore() }, [])


const loadMore = useCallback(async () => {
if(loading) return
setLoading(true)
const data = await reelsService.fetchReels({ offset: reels.length, limit: 5 })
setReels(r=>[...r, ...data])
setLoading(false)
}, [loading, reels.length])


// infinite scroll: when near bottom of array, append more
useEffect(()=>{
const onScroll = () => {
const el = containerRef.current
if(!el) return
const scrollBottom = el.scrollTop + window.innerHeight
if(scrollBottom + 400 >= el.scrollHeight){ loadMore() }
}
window.addEventListener('scroll', onScroll)
return () => window.removeEventListener('scroll', onScroll)
}, [loadMore])


return (
<div ref={containerRef} className="snap-y snap-mandatory h-screen overflow-y-auto">
{reels.map(r => (
<div key={r.id} className="snap-start h-screen">
<Reel reel={r} onOpenComments={onOpenComments} />
</div>
))}
{loading && <div className="text-center py-8">Loading...</div>}
</div>
)
}
