import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'


export default function App(){
return (
<div className="min-h-screen bg-gray-900 text-white">
<Header />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/dashboard" element={<Dashboard />} />
</Routes>
</div>
)
}