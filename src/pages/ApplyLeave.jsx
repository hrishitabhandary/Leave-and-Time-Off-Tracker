import { useState, useEffect } from 'react'

function ApplyLeave({ currentUser }) {
  const [managers, setManagers] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])
  const [form, setForm] = useState({
    leave_type_id: '',
    manager_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  })
  const [workingDays, setWorkingDays] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/users/managers')
      .then(res => res.json())
      .then(data => setManagers(data))

    fetch(`http://localhost:5000/api/users/${currentUser.id}/balance`)
      .then(res => res.json())
      .then(data => setLeaveTypes(data.map(b => ({
        id: b.leave_type,
        name: `${b.leave_type} (${b.remaining} days left)`
      }))))
  }, [currentUser])

  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0
    let count = 0
    let current = new Date(start)
    const endDate = new Date(end)
    while (current <= endDate) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) count++
      current.setDate(current.getDate() + 1)
    }
    return count
  }

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (updated.start_date && updated.end_date) {
      setWorkingDays(calculateWorkingDays(updated.start_date, updated.end_date))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.leave_type_id || !form.manager_id || !form.start_date || !form.end_date || !form.reason) {
      setError('Please fill in all fields')
      return
    }

    const allLeaves = await fetch('http://localhost:5000/api/leaves').then(r => r.json())
    const typeNameToId = {}
    allLeaves.forEach(l => { typeNameToId[l.leave_type_name] = l.leave_type_id })

    const leave_type_id = typeNameToId[form.leave_type_id]
    if (!leave_type_id) {
      setError('Could not find leave type. Please select again.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          manager_id: form.manager_id,
          leave_type_id,
          start_date: form.start_date,
          end_date: form.end_date,
          reason: form.reason
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setSuccess('Leave applied successfully!')
        setForm({
          leave_type_id: '',
          manager_id: '',
          start_date: '',
          end_date: '',
          reason: ''
        })
        setWorkingDays(0)
      }
    } catch {
      setError('Server error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto text-white">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        📝 <span className="text-indigo-400">Apply for Leave</span>
      </h1>
      <p className="text-sm mb-8 text-gray-400">
        Fill in the details below to submit your leave request
      </p>

      {/* Form Card */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Leave Type</label>
            <select
              name="leave_type_id"
              value={form.leave_type_id}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((lt, i) => (
                <option key={i} value={lt.id} className="bg-[#020617]">
                  {lt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Manager */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Apply To (Manager)</label>
            <select
              name="manager_id"
              value={form.manager_id}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Manager</option>
              {managers.map(m => (
                <option key={m.id} value={m.id} className="bg-[#020617]">
                  {m.name} — {m.department}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Working Days */}
          {workingDays > 0 && (
            <div className="rounded-lg px-4 py-3 text-sm font-medium bg-green-500/10 border border-green-500/20 text-green-400">
              📅 {workingDays} working day(s) — weekends excluded
            </div>
          )}

          {/* Reason */}
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Brief reason for leave..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Error */}
          {error && (
            <div className="rounded-lg px-4 py-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-lg px-4 py-3 text-sm bg-green-500/10 border border-green-500/20 text-green-400">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default ApplyLeave