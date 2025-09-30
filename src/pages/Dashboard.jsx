
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { analyticsService } from '../services/analyticsService'

export default function Dashboard() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(analyticsService.getSummary())
  }, [])

  function refresh() {
    setData(analyticsService.getSummary())
  }

  function downloadCSV() {
    const csv = analyticsService.exportCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Creator Dashboard</h2>
      <div className="mb-4 flex gap-2">
        <button onClick={refresh} className="px-3 py-1 bg-white text-black rounded">Refresh</button>
        <button onClick={downloadCSV} className="px-3 py-1 rounded border">Export CSV</button>
        <button onClick={() => { analyticsService.clear(); refresh() }} className="px-3 py-1 rounded border">Clear</button>
      </div>

      <div className="h-64">
        {data.length === 0 ? <div className="p-6">No analytics yet. Start watching reels to generate events.</div> :
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="impressions" stroke="#8884d8" />
              <Line type="monotone" dataKey="watchComplete" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        }
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Raw table</h3>
        <table className="w-full text-left">
          <thead><tr><th>Date</th><th>Impressions</th><th>WatchComplete</th><th>Likes</th><th>Comments</th></tr></thead>
          <tbody>
            {data.map(r => (
              <tr key={r.date} className="border-t border-gray-700">
                <td>{r.date}</td>
                <td>{r.impressions}</td>
                <td>{r.watchComplete}</td>
                <td>{r.likes}</td>
                <td>{r.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

