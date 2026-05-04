import { useState, useEffect } from 'react'
import LeaveCard from '../components/LeaveCard'

function Dashboard({ currentUser }) {
  const [balance, setBalance] = useState([])
  const [leaves, setLeaves] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBalance()
    fetchLeaves()
  }, [currentUser])

  const fetchBalance = () => {
    fetch(`http://localhost:5000/api/users/${currentUser.id}/balance`)
      .then(res => res.json())
      .then(data => setBalance(data))
  }

  const fetchLeaves = () => {
    setLoading(true)
    let url = `http://localhost:5000/api/leaves?user_id=${currentUser.id}`
    if (statusFilter) url += `&status=${statusFilter}`
    if (startDate) url += `&start_date=${startDate}`
    if (endDate) url += `&end_date=${endDate}`
    fetch(url)
      .then(res => res.json())
      .then(data => { setLeaves(data); setLoading(false) })
  }

  const handleClear = () => {
    setStatusFilter('')
    setStartDate('')
    setEndDate('')
    fetch(`http://localhost:5000/api/leaves?user_id=${currentUser.id}`)
      .then(res => res.json())
      .then(data => setLeaves(data))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          👋 Welcome, <span className="text-indigo-400">{currentUser.name}</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {currentUser.department} • {currentUser.role}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Leave Balance</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {balance.map((b, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 backdrop-blur-lg hover:scale-105 transition"
            >
              <p className="text-xs text-gray-400 mb-1">{b.leave_type}</p>
              <h2 className="text-3xl font-bold">{b.remaining}</h2>
              <p className="text-xs text-gray-500 mt-1">
                of {b.yearly_quota} remaining
              </p>

              <div className="w-full h-1.5 bg-white/10 rounded-full mt-3">
                <div
                  className="h-1.5 rounded-full bg-indigo-400"
                  style={{ width: `${(b.remaining / b.yearly_quota) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Leave History</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
           >
            <option value="" className="bg-[#020617] text-white">All Status</option>
            <option value="pending" className="bg-[#020617] text-white">Pending</option>
            <option value="approved" className="bg-[#020617] text-white">Approved</option>
            <option value="rejected" className="bg-[#020617] text-white">Rejected</option>
          </select>

          <input
            type="date"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />

          <button
            onClick={fetchLeaves}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Filter
          </button>

          <button
            onClick={handleClear}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm"
          >
            Clear
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">📭</div>
            <p>No leave requests found</p>
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="flex flex-col gap-3 md:hidden">
              {leaves.map(leave => (
                <LeaveCard key={leave.id} leave={leave} isManager={false} />
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Type','From','To','Days','Reason','Status','Comment'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-gray-400 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {leaves.map(leave => (
                    <tr key={leave.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 pr-4 text-gray-300">{leave.leave_type_name}</td>
                      <td className="py-3 pr-4 text-gray-300">{leave.start_date}</td>
                      <td className="py-3 pr-4 text-gray-300">{leave.end_date}</td>
                      <td className="py-3 pr-4 text-gray-300">{leave.working_days}</td>
                      <td className="py-3 pr-4 text-gray-400">{leave.reason}</td>

                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${leave.status === 'approved' && 'bg-green-500/10 text-green-400'}
                          ${leave.status === 'rejected' && 'bg-red-500/10 text-red-400'}
                          ${leave.status === 'pending' && 'bg-yellow-500/10 text-yellow-400'}
                        `}>
                          {leave.status}
                        </span>
                      </td>

                      <td className="py-3 pr-4 text-gray-500">
                        {leave.manager_comment || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard