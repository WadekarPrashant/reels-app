// src/firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_MSG_SENDER_ID>",
  appId: "<YOUR_APP_ID>"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)

// enable offline persistence (best effort)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn('Firestore persistence failed:', err.code)
  })
} catch (e) {
  console.warn('Could not enable persistence', e)
}
