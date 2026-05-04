import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar({ currentUser }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/apply', label: '📝 Apply Leave' },
    { path: '/calendar', label: '📅 Calendar' },
    ...(currentUser?.role === 'manager'
      ? [{ path: '/manager', label: '👔 Manager View' }]
      : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="font-bold text-xl text-white tracking-tight">
          🏖️ <span className="text-indigo-400">LeaveTracker</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition
                ${isActive(link.path)
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-xl text-gray-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white/5 border-t border-white/10">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium px-3 py-2 rounded-lg
                ${isActive(link.path)
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar