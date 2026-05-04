import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ApplyLeave from './pages/ApplyLeave'
import ManagerView from './pages/ManagerView'
import Calendar from './pages/Calendar'
import { useState, useEffect } from 'react'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setCurrentUser(data[0])
      })
  }, [])

  if (!currentUser) return (
    <div className="flex items-center justify-center h-screen text-gray-400 bg-[#020617]">
      Loading...
    </div>
  )

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">

        {/* User Switcher */}
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-gray-400 text-sm">Logged in as:</span>

          <select
            className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={currentUser.id}
            onChange={e => setCurrentUser(users.find(u => u.id == e.target.value))}
          >
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-[#020617]">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Navbar */}
        <Navbar currentUser={currentUser} />

        {/* Page Content */}
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={
              <div className="w-full">
                <Dashboard currentUser={currentUser} />
              </div>
            } />

            <Route path="/apply" element={
              <div className="w-full max-w-2xl">
                <ApplyLeave currentUser={currentUser} />
              </div>
            } />

            <Route path="/manager" element={
              <div className="w-full">
                <ManagerView currentUser={currentUser} />
              </div>
            } />

            <Route path="/calendar" element={
              <div className="w-full">
                <Calendar />
              </div>
            } />

          </Routes>

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App