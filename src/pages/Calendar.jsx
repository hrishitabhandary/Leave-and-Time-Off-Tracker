import { useState, useEffect } from 'react'

function Calendar() {
  const [leaves, setLeaves] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/leaves/calendar')
      .then(res => res.json())
      .then(data => { setLeaves(data); setLoading(false) })
  }, [])

  const getWeekDays = (offsetWeeks = 0) => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1 + offsetWeeks * 7)
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d.toISOString().split('T')[0]
    })
  }

  const thisWeek = getWeekDays(0)
  const nextWeek = getWeekDays(1)

  const isOnLeave = (leave, date) => leave.start_date <= date && leave.end_date >= date

  const filteredLeaves = filter ? leaves.filter(l => l.leave_type_name === filter) : leaves
  const leaveTypes = [...new Set(leaves.map(l => l.leave_type_name))]

  const renderWeek = (days, title) => (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {days[0]} → {days[4]}
        </p>
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-gray-400">Employee</th>

              {days.map(d => (
                <th key={d} className="px-4 py-3 text-gray-400 text-center">
                  {new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric'
                  })}
                </th>
              ))}

              <th className="text-left px-5 py-3 text-gray-400">Type</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No one on leave 🎉
                </td>
              </tr>
            ) : (
              filteredLeaves.map(leave => (
                <tr
                  key={leave.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-5 py-3 text-white font-medium">
                    {leave.employee_name}
                  </td>

                  {days.map(d => (
                    <td key={d} className="px-4 py-3 text-center">
                      {isOnLeave(leave, d) ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-red-500/10 text-red-400">
                          ✕
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs bg-green-500/10 text-green-400">
                          ✓
                        </span>
                      )}
                    </td>
                  ))}

                  <td className="px-5 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400">
                      {leave.leave_type_name}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden p-4 flex flex-col gap-3">
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No one on leave 🎉
          </div>
        ) : (
          filteredLeaves.map(leave => (
            <div
              key={leave.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="font-semibold text-white">
                {leave.employee_name}
              </div>
              <div className="text-xs text-gray-400">
                {leave.department}
              </div>
              <div className="text-sm text-gray-300">
                📅 {leave.start_date} → {leave.end_date}
              </div>
              <span className="mt-2 inline-block px-2 py-1 rounded-full text-xs bg-indigo-500/10 text-indigo-400">
                {leave.leave_type_name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 text-white">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          📅 <span className="text-indigo-400">Team Calendar</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          See who is on leave this week and next week
        </p>
      </div>

      {/* Legend + Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">

        <div className="flex gap-5 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500/20"></span> On Leave
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500/20"></span> Present
          </span>
        </div>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Leave Types</option>
          {leaveTypes.map(lt => (
            <option key={lt} value={lt} className="bg-[#020617]">
              {lt}
            </option>
          ))}
        </select>

      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {renderWeek(thisWeek, '📅 This Week')}
          {renderWeek(nextWeek, '📆 Next Week')}
        </div>
      )}
    </div>
  )
}

export default Calendar