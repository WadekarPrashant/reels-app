// src/components/ReelList.jsx
import React, { useEffect, useState } from 'react'
import Reel from './Reel'
import { reelsService } from '../services/reelsService'

export default function ReelList({ onOpenComments }) {
  const [reels, setReels] = useState([])

  useEffect(() => {
    // realtime feed subscription
    const unsub = reelsService.listenFeed((data) => {
      setReels(data)
    })
    return () => unsub()
  }, [])

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-auto">
      {reels.map(r => (
        <div key={r.id} className="snap-start h-screen">
          <Reel reel={r} onOpenComments={onOpenComments}/>
        </div>
      ))}
    </div>
  )
}
