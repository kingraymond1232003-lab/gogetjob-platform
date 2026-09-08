import React from 'react'
import { Link } from 'react-router-dom'
import LiveActivityTicker from '../components/LiveActivityTicker'

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4 inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            🎉 New: Post Your First Job On Credit Up To ₦300!
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Micro Jobs in Nigeria & Promote Your Brand
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Nigeria’s #1 Verified Earning Platform. Earn Real Money Online in Nigeria with Simple Daily Tasks.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Earning Free
            </Link>
            <Link
              to="/register?type=employer"
              className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors border-2 border-white"
            >
              For Businesses / Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">19k+</div>
              <div className="text-gray-600 font-medium">Workers</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">65k+</div>
              <div className="text-gray-600 font-medium">Jobs Completed</div>
            </div>
            <div className="stat-card text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">₦25M</div>
              <div className="text-gray-600 font-medium">Job Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Ticker */}
      <section className="py-6 px-4 max-w-6xl mx-auto">
        <LiveActivityTicker />
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold mb-3">Create Free Account</h3>
              <p className="text-gray-600">Sign up in under 2 minutes with email and phone number</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold mb-3">Complete Simple Tasks</h3>
              <p className="text-gray-600">Browse social media, app, and survey tasks</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold mb-3">Withdraw Earnings</h3>
              <p className="text-gray-600">Direct Nigerian bank transfers or airtime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Rate Cards */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Available Task Categories & Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'App Downloads', rate: '₦500-₦7,000', icon: '📱' },
              { name: 'Telegram', rate: '₦150-₦500', icon: '✈️' },
              { name: 'Twitter/X', rate: '₦100-₦500', icon: '𝕏' },
              { name: 'Instagram', rate: '₦150-₦500', icon: '📷' },
              { name: 'TikTok', rate: '₦150-₦500', icon: '🎵' },
              { name: 'YouTube', rate: '₦200-₦500', icon: '📺' },
              { name: 'Surveys', rate: '₦150-₦500', icon: '📋' },
              { name: 'Website Tasks', rate: '₦250-₦1,000', icon: '🌐' },
              { name: 'Google Reviews', rate: '₦350-₦500', icon: '⭐' },
            ].map((cat, idx) => (
              <div key={idx} className="card hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                <p className="text-blue-600 font-semibold">{cat.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Chioma O.', school: 'UNILAG', earnings: '₦45,000', rating: 5 },
              { name: 'Segun A.', school: 'UI, Ibadan', earnings: '₦38,500', rating: 5 },
              { name: 'Zainab M.', school: 'Kano', earnings: '₦52,300', rating: 5 },
            ].map((testimonial, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.school}</p>
                  </div>
                </div>
                <div className="mb-3 text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
                <p className="text-green-600 font-bold">{testimonial.earnings} Earned</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Make Money Online in Nigeria</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Gogetjob is Nigeria’s leading platform for micro-tasks and digital engagement. Looking to make money online from your phone or computer? We offer simple, verified earning opportunities including app tasks, social media engagement, surveys, and brand promotion. Join thousands of Nigerians earning real money daily through flexible micro-jobs. Whether you’re a student, freelancer, or looking for side hustle jobs in Nigeria, Gogetjob provides instant payouts via bank transfer or airtime. Earn extra income completing tasks from companies across Africa and globally.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-gray-700">
              <strong className="text-blue-600">Popular Searches:</strong>
              <ul className="mt-3 space-y-2 text-sm">
                <li>✓ Make money online Nigeria</li>
                <li>✓ Micro jobs Nigeria</li>
                <li>✓ Side hustles for students</li>
                <li>✓ Earn money from home</li>
              </ul>
            </div>
            <div className="text-gray-700">
              <strong className="text-blue-600">Popular Cities:</strong>
              <ul className="mt-3 space-y-2 text-sm">
                <li>✓ Earn money in Lagos</li>
                <li>✓ Jobs in Abuja</li>
                <li>✓ Online tasks in Port Harcourt</li>
                <li>✓ Remote work opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
