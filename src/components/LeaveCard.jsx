function LeaveCard({ leave, onApprove, onReject, isManager }) {
  const statusStyle = {
    pending: { backgroundColor: '#451a03', color: '#fdba74', border: '1px solid #92400e' },
    approved: { backgroundColor: '#064e3b', color: '#6ee7b7', border: '1px solid #065f46' },
    rejected: { backgroundColor: '#450a0a', color: '#fca5a5', border: '1px solid #7f1d1d' },
  }

  return (
    <div className="rounded-xl p-4 flex flex-col gap-3"
      style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}>

      {/* Top Row */}
      <div className="flex items-center justify-between">
        <span className="font-semibold" style={{color: '#fff'}}>
          {leave.employee_name || 'You'}
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={statusStyle[leave.status]}>
          {leave.status.toUpperCase()}
        </span>
      </div>

      {/* Leave Type */}
      <div className="text-sm" style={{color: '#888'}}>
        📋 <span style={{color: '#ccc'}}>{leave.leave_type_name}</span>
      </div>

      {/* Dates */}
      <div className="text-sm" style={{color: '#888'}}>
        📅 <span style={{color: '#ccc'}}>{leave.start_date}</span>
        <span style={{color: '#555'}}> → </span>
        <span style={{color: '#ccc'}}>{leave.end_date}</span>
        <span className="ml-2 text-xs" style={{color: '#555'}}>({leave.working_days} days)</span>
      </div>

      {/* Reason */}
      <div className="text-sm" style={{color: '#888'}}>
        💬 {leave.reason}
      </div>

      {/* Manager Comment */}
      {leave.manager_comment && (
        <div className="text-sm rounded-lg px-3 py-2"
          style={{backgroundColor: '#1e1b4b', color: '#a5b4fc', border: '1px solid #3730a3'}}>
          👔 {leave.manager_comment}
        </div>
      )}

      {/* Manager Actions */}
      {isManager && leave.status === 'pending' && (
        <div className="flex gap-2 mt-1">
          <button onClick={() => onApprove(leave.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium"
            style={{backgroundColor: '#064e3b', color: '#6ee7b7', border: '1px solid #065f46'}}>
            ✅ Approve
          </button>
          <button onClick={() => onReject(leave.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium"
            style={{backgroundColor: '#450a0a', color: '#fca5a5', border: '1px solid #7f1d1d'}}>
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default LeaveCard