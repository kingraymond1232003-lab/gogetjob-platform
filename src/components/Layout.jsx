import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import NavBar from './NavBar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">Gogetjob</h3>
              <p className="text-sm">Nigeria's #1 Verified Earning Platform</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">All Jobs</a></li>
                <li><a href="#" className="hover:text-white">Categories</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Businesses</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Gogetjob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
