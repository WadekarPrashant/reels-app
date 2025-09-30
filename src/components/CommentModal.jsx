// src/components/CommentModal.jsx
import React, { useEffect, useState } from 'react'
import { reelsService } from '../services/reelsService'

export default function CommentModal({ reel, onClose }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    // get static list + you may add onSnapshot based listener if desired
    let mounted = true
    reelsService.getComments(reel.id).then(list => {
      if (mounted) setComments(list)
    })
    return () => { mounted = false }
  }, [reel.id])

  async function handleComment() {
    if (!text) return
    const c = await reelsService.postComment(reel.id, { user: 'you', text })
    setComments(prev => [...prev, c])
    setText('')
  }

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black/60">
      <div className="bg-gray-900 p-4 w-full max-w-2xl rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <strong>Comments</strong>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="max-h-60 overflow-y-auto mb-3">
          {comments.map(c => (<div key={c.id} className="py-2 border-b border-gray-800"><strong>@{c.user}</strong>: {c.text}</div>))}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} className="flex-1" placeholder="Write a comment" />
          <button onClick={handleComment} className="px-3 py-1 bg-white text-black">Send</button>
        </div>
      </div>
    </div>
  )
}
