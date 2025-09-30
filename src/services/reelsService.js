// src/services/reelsService.js
import {
  collection, doc, getDocs, query, orderBy, limit, addDoc, onSnapshot,
  updateDoc, increment, serverTimestamp, getDoc
} from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebaseConfig'

// Collection names
const REELS_COL = 'reels'
const COMMENTS_SUBCOL = 'comments'

export const reelsService = {
  // fetch initial page (chronological)
  fetchReels: async ({ offset = 0, limit: L = 10 } = {}) => {
    const q = query(collection(db, REELS_COL), orderBy('createdAt', 'desc'), limit(L))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  // realtime listener for a single reel
  listenReel: (id, callback) => {
    const d = doc(db, REELS_COL, id)
    return onSnapshot(d, snap => {
      callback({ id: snap.id, ...snap.data() })
    })
  },

  // global listener for feed (for optimistic real-time updates)
  listenFeed: (callback) => {
    const q = query(collection(db, REELS_COL), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      callback(data)
    })
  },

  like: async (id) => {
    const d = doc(db, REELS_COL, id)
    await updateDoc(d, { likes: increment(1) })
    return true
  },

  postComment: async (id, { user, text }) => {
    const commentsRef = collection(db, REELS_COL, id, COMMENTS_SUBCOL)
    const c = await addDoc(commentsRef, {
      user,
      text,
      createdAt: serverTimestamp()
    })
    // also increment comment count in reel doc (atomic increment)
    const reelDoc = doc(db, REELS_COL, id)
    await updateDoc(reelDoc, { commentsCount: increment(1) })
    return { id: c.id, user, text }
  },

  uploadReel: async ({ file, user, caption }) => {
    // 1) upload file to storage
    const sRef = storageRef(storage, `reels/${Date.now()}_${file.name}`)
    const task = uploadBytesResumable(sRef, file)
    await new Promise((res, rej) => {
      task.on('state_changed', null, rej, res)
    })
    const url = await getDownloadURL(sRef)
    // 2) create document
    const docRef = await addDoc(collection(db, REELS_COL), {
      user,
      caption,
      src: url,
      likes: 0,
      commentsCount: 0,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, user, caption, src: url }
  },

  getComments: async (id) => {
    const cSnap = await getDocs(collection(db, REELS_COL, id, COMMENTS_SUBCOL))
    return cSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  }
}
