import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { withdrawalAPI, usersAPI } from '../../services/api'

function getWithdrawalStatus() {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()

  // Friday 10 AM - Monday 10 AM: Airtime window
  const isFridayToMonday = (day === 5 && hours >= 10) || day === 6 || (day === 0 && hours < 10)
  
  // Monday 12 PM - Friday 12 PM: Bank window
  const isMondayToFriday = (day === 0 && hours >= 12) || (day >= 1 && day <= 4) || (day === 5 && hours < 12)

  if (isFridayToMonday) {
    return {
      status: 'airtime-open',
      message: 'Airtime Purchases are currently OPEN. Bank Withdrawals are disabled and will open Monday at 12:00 PM.',
    }
  }
  if (isMondayToFriday) {
    return {
      status: 'bank-open',
      message: 'Bank Withdrawals are currently OPEN. Airtime Purchases are disabled and will open Friday at 10:00 AM.',
    }
  }
  return {
    status: 'closed',
    message: 'Withdrawal services are currently closed. Please check back during available windows.',
  }
}

export default function WorkerDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ jobsDone: 0, walletBalance: 0, pendingBalance: 0 })
  const [withdrawalStatus] = useState(getWithdrawalStatus())
  const [activeTab, setActiveTab] = useState('overview')
  const [withdrawalForm, setWithdrawalForm] = useState({ type: 'bank', amount: '', details: '' })
  const [taskHistory] = useState([])
  const [referralData, setReferralData] = useState({ link: '', referrals: 0, bonuses: 0, commissions: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const balanceRes = await usersAPI.getBalance()
        setStats(balanceRes.data)
        const refRes = await usersAPI.getReferralCode()
        setReferralData(refRes.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }
    loadData()
  }, [])

  const handleWithdrawal = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (withdrawalForm.type === 'bank') {
        await withdrawalAPI.requestBankWithdrawal({
          amount: parseFloat(withdrawalForm.amount),
          bankDetails: withdrawalForm.details,
        })
      } else {
        await withdrawalAPI.requestAirtimeWithdrawal({
          amount: parseFloat(withdrawalForm.amount),
          phoneNumber: withdrawalForm.details,
        })
      }
      alert('Withdrawal request submitted successfully!')
      setWithdrawalForm({ type: 'bank', amount: '', details: '' })
    } catch (error) {
      alert('Failed to process withdrawal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.fullName}!</h1>
        <p className="text-gray-600 mt-2">Manage your tasks and earnings</p>
      </div>

      {/* Withdrawal Status Banner */}
      <div className={`p-4 rounded-lg mb-8 border-l-4 ${
        withdrawalStatus.status === 'bank-open' ? 'bg-green-50 border-green-600' :
        withdrawalStatus.status === 'airtime-open' ? 'bg-blue-50 border-blue-600' :
        'bg-yellow-50 border-yellow-600'
      }`}>
        <p className="font-semibold text-gray-800">{withdrawalStatus.message}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card">
          <div className="text-3xl font-bold text-blue-600">{stats.jobsDone}</div>
          <div className="text-gray-600 font-medium">Total Jobs Done</div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-bold text-green-600">₦{stats.walletBalance.toLocaleString()}</div>
          <div className="text-gray-600 font-medium">Available Balance</div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-bold text-orange-600">₦{stats.pendingBalance.toLocaleString()}</div>
          <div className="text-gray-600 font-medium">Pending Balance</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          {['overview', 'withdrawal', 'referral', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Dashboard Overview</h3>
              <p className="text-gray-600 mb-4">
                You have completed {stats.jobsDone} verified tasks and earned ₦{stats.walletBalance.toLocaleString()}.
              </p>
              <p className="text-gray-600">Keep completing tasks to earn more. Refer friends to earn extra 5% commission!</p>
            </div>
          )}

          {/* Withdrawal Tab */}
          {activeTab === 'withdrawal' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Request Withdrawal</h3>
              <form onSubmit={handleWithdrawal} className="max-w-md">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Withdrawal Type</label>
                  <select
                    value={withdrawalForm.type}
                    onChange={(e) => setWithdrawalForm({...withdrawalForm, type: e.target.value})}
                    disabled={withdrawalStatus.status === 'closed'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="bank">Bank Withdrawal</option>
                    <option value="airtime">Airtime Purchase</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Amount (₦)</label>
                  <input
                    type="number"
                    required
                    value={withdrawalForm.amount}
                    onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="1000"
                    min="100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {withdrawalForm.type === 'bank' ? 'Bank Details' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawalForm.details}
                    onChange={(e) => setWithdrawalForm({...withdrawalForm, details: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder={withdrawalForm.type === 'bank' ? 'Bank account number' : 'Phone number'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || withdrawalStatus.status === 'closed'}
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Submit Request'}
                </button>
              </form>
            </div>
          )}

          {/* Referral Tab */}
          {activeTab === 'referral' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Referral Program</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <p className="text-gray-700 font-medium mb-3">Your Referral Link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralData.link}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(referralData.link)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card">
                  <div className="text-2xl font-bold text-blue-600">{referralData.referrals}</div>
                  <div className="text-gray-600">Referred Users</div>
                </div>
                <div className="card">
                  <div className="text-2xl font-bold text-green-600">₦{referralData.bonuses.toLocaleString()}</div>
                  <div className="text-gray-600">Sign-up Bonuses</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>5% Commission:</strong> ₦{referralData.commissions.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Task History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Task</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Reward</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskHistory.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-gray-600">
                          No task history yet. Start completing tasks to earn!
                        </td>
                      </tr>
                    ) : (
                      taskHistory.map((task, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-3">{task.name}</td>
                          <td className="px-4 py-3 font-semibold text-green-600">₦{task.reward}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              task.status === 'approved' ? 'bg-green-100 text-green-800' :
                              task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{task.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
