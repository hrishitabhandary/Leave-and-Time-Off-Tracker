import { useState, useEffect } from 'react'
import LeaveCard from '../components/LeaveCard'

function ManagerView({ currentUser }) {
  const [requests, setRequests] = useState([])
  const [statusFilter, setStatusFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [actionType, setActionType] = useState('')

  useEffect(() => {
    if (currentUser.role === 'manager') fetchRequests()
  }, [currentUser, statusFilter])

  const fetchRequests = () => {
    setLoading(true)
    let url = `http://localhost:5000/api/managers/${currentUser.id}/requests`
    if (statusFilter) url += `?status=${statusFilter}`
    fetch(url)
      .then(res => res.json())
      .then(data => { setRequests(data); setLoading(false) })
  }

  const handleAction = async () => {
    const url = `http://localhost:5000/api/managers/${currentUser.id}/requests/${selectedLeave}/${actionType}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manager_comment: comment })
    })
    if (res.ok) {
      setSelectedLeave(null)
      setComment('')
      setActionType('')
      fetchRequests()
    }
  }

  const openModal = (leaveId, type) => {
    setSelectedLeave(leaveId)
    setActionType(type)
    setComment('')
  }

  if (currentUser.role !== 'manager') {
    return (
      <div className="text-center py-24 text-gray-400">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-lg font-medium">This page is only for managers</p>
        <p className="text-sm mt-2 text-gray-500">
          Switch to a manager account using the dropdown above
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 text-white">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          👔 <span className="text-indigo-400">Manager View</span>
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Review and action leave requests assigned to you
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'approved', 'rejected', ''].map((s, i) => (
          <button
            key={i}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${statusFilter === s
                ? 'bg-indigo-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">📭</div>
          <p>No requests found</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {requests.map(leave => (
              <LeaveCard
                key={leave.id}
                leave={leave}
                isManager={true}
                onApprove={(id) => openModal(id, 'approve')}
                onReject={(id) => openModal(id, 'reject')}
              />
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Employee','Dept','Type','From','To','Days','Reason','Status','Comment','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {requests.map(leave => (
                  <tr key={leave.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-medium text-white">{leave.employee_name}</td>
                    <td className="px-4 py-3 text-gray-400">{leave.department}</td>
                    <td className="px-4 py-3 text-gray-300">{leave.leave_type_name}</td>
                    <td className="px-4 py-3 text-gray-300">{leave.start_date}</td>
                    <td className="px-4 py-3 text-gray-300">{leave.end_date}</td>
                    <td className="px-4 py-3 text-gray-300">{leave.working_days}</td>
                    <td className="px-4 py-3 text-gray-400">{leave.reason}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${leave.status === 'approved' && 'bg-green-500/10 text-green-400'}
                        ${leave.status === 'rejected' && 'bg-red-500/10 text-red-400'}
                        ${leave.status === 'pending' && 'bg-yellow-500/10 text-yellow-400'}
                      `}>
                        {leave.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {leave.manager_comment || '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(leave.id, 'approve')}
                            className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs hover:bg-green-500/20"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => openModal(leave.id, 'reject')}
                            className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs hover:bg-red-500/20"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 px-4">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            
            <h2 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Leave' : 'Reject Leave'}
            </h2>

            <textarea
              rows={3}
              placeholder="Optional comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAction}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold
                  ${actionType === 'approve'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  }`}
              >
                Confirm
              </button>

              <button
                onClick={() => setSelectedLeave(null)}
                className="flex-1 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerView