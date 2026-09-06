import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function NavBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Secret admin code detection
    if (searchQuery === import.meta.env.VITE_ADMIN_SECRET_CODE) {
      navigate('/admin')
      setSearchQuery('')
      return
    }

    // Regular search
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`)
    setSearchQuery('')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl text-blue-600">
            <span className="mr-2">💼</span>
            Gogetjob
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">All Jobs</Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">Categories</Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">How It Works</Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4 max-w-sm">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {/* Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 text-sm">
                  {user.fullName}
                </span>
                <Link
                  to={user.role === 'worker' ? '/dashboard/worker' : user.role === 'employer' ? '/dashboard/employer' : '/admin'}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t pt-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </form>
            
            <Link to="/" className="block text-gray-600 hover:text-gray-900">All Jobs</Link>
            <Link to="#" className="block text-gray-600 hover:text-gray-900">Categories</Link>
            <Link to="#" className="block text-gray-600 hover:text-gray-900">How It Works</Link>
            
            {user ? (
              <>
                <Link
                  to={user.role === 'worker' ? '/dashboard/worker' : user.role === 'employer' ? '/dashboard/employer' : '/admin'}
                  className="block text-blue-600 hover:text-blue-700 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-blue-600 hover:text-blue-700">Login</Link>
                <Link to="/register" className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
