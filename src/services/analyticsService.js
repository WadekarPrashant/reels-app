// src/services/analyticsService.js
// This is a lightweight in-app analytics logger storing events in IndexedDB/localStorage.
// For production push events to a backend or stream to BigQuery/Influx etc.

const STORAGE_KEY = 'reels_analytics_v1'

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export const analyticsService = {
  logEvent: (type, payload = {}) => {
    const events = loadEvents()
    events.push({ type, payload, ts: Date.now() })
    saveEvents(events)
  },

  getSummary: () => {
    const events = loadEvents()
    // compute simple metrics per-day
    const byDay = {}
    events.forEach(e => {
      const day = new Date(e.ts).toISOString().slice(0,10)
      byDay[day] = byDay[day] || { impressions:0, watchComplete:0, likes:0, comments:0 }
      if (e.type === 'impression') byDay[day].impressions++
      if (e.type === 'watchComplete') byDay[day].watchComplete++
      if (e.type === 'like') byDay[day].likes++
      if (e.type === 'comment') byDay[day].comments++
    })
    const rows = Object.keys(byDay).sort().map(day => ({ date: day, ...byDay[day] }))
    return rows
  },

  exportCSV: () => {
    const rows = analyticsService.getSummary()
    // simple CSV
    const header = ['date', 'impressions', 'watchComplete', 'likes', 'comments']
    const csv = [header.join(',')].concat(rows.map(r => [r.date, r.impressions, r.watchComplete, r.likes, r.comments].join(','))).join('\n')
    return csv
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY)
  }
}
