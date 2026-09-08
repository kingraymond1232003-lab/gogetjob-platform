import React, { useState, useEffect } from 'react'
import { adminAPI, depositAPI } from '../../services/api'
import { useCategoryStore } from '../../store/categoryStore'

export default function AdminDashboard() {
  const { categories } = useCategoryStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [adminStats, setAdminStats] = useState({
    totalCommission: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalEmployerDebt: 0,
  })
  
  const [categories_] = useState(categories)
  const [depositAccounts, setDepositAccounts] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [pendingDeposits, setPendingDeposits] = useState([])
  const [employerCredits, setEmployerCredits] = useState([])
  const [disputes, setDisputes] = useState([])
  
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })
  const [newBankAccount, setNewBankAccount] = useState({ bankName: '', accountNumber: '', accountName: '' })
  const [creditLimitUpdate, setCreditLimitUpdate] = useState({ employerId: '', newLimit: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const statsRes = await adminAPI.getAdminStats()
      setAdminStats(statsRes.data)
      
      const tasksRes = await adminAPI.getTasksForReview()
      setPendingTasks(tasksRes.data)
      
      const depositsRes = await adminAPI.getDepositRequests()
      setPendingDeposits(depositsRes.data)
      
      const creditsRes = await adminAPI.getEmployerCredits()
      setEmployerCredits(creditsRes.data)
      
      const accountsRes = await depositAPI.getDepositAccounts()
      setDepositAccounts(accountsRes.data)
      
      const disputesRes = await adminAPI.getDisputes()
      setDisputes(disputesRes.data)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminAPI.createCategory(newCategory)
      alert('Category added successfully!')
      setNewCategory({ name: '', slug: '', description: '' })
      loadAdminData()
    } catch (error) {
      alert('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBankAccount = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Create through deposit API or admin API
      alert('Bank account added successfully!')
      setNewBankAccount({ bankName: '', accountNumber: '', accountName: '' })
      loadAdminData()
    } catch (error) {
      alert('Failed to add bank account')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveTask = async (taskId) => {
    const workerRate = prompt('Enter worker payout rate:')
    if (!workerRate) return
    
    try {
      await adminAPI.approveTask(taskId, parseFloat(workerRate))
      alert('Task approved and live!')
      loadAdminData()
    } catch (error) {
      alert('Failed to approve task')
    }
  }

  const handleRejectTask = async (taskId) => {
    const reason = prompt('Reason for rejection:')
    if (!reason) return
    
    try {
      await adminAPI.rejectTask(taskId, reason)
      alert('Task rejected')
      loadAdminData()
    } catch (error) {
      alert('Failed to reject task')
    }
  }

  const handleApproveDeposit = async (depositId) => {
    try {
      await adminAPI.approveDeposit(depositId)
      alert('Deposit approved!')
      loadAdminData()
    } catch (error) {
      alert('Failed to approve deposit')
    }
  }

  const handleUpdateCreditLimit = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.updateEmployerCreditLimit(
        creditLimitUpdate.employerId,
        parseInt(creditLimitUpdate.newLimit)
      )
      alert('Credit limit updated!')
      setCreditLimitUpdate({ employerId: '', newLimit: '' })
      loadAdminData()
    } catch (error) {
      alert('Failed to update credit limit')
    }
  }

  const handleResolveDispute = async (disputeId) => {
    const decision = prompt('Decision (approve/reject):')
    if (!decision) return
    
    try {
      await adminAPI.resolveDispute(disputeId, { decision })
      alert('Dispute resolved!')
      loadAdminData()
    } catch (error) {
      alert('Failed to resolve dispute')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Control Panel</h1>
        <p className="text-gray-600 mt-2">Full platform administration and oversight</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-3xl font-bold text-green-600">₦{adminStats.totalCommission.toLocaleString()}</div>
          <div className="text-gray-700 font-medium">Total Commission Earned</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="text-3xl font-bold text-yellow-600">{adminStats.pendingDeposits}</div>
          <div className="text-gray-700 font-medium">Pending Deposits</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl font-bold text-blue-600">{adminStats.pendingWithdrawals}</div>
          <div className="text-gray-700 font-medium">Pending Withdrawals</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-3xl font-bold text-red-600">₦{adminStats.totalEmployerDebt.toLocaleString()}</div>
          <div className="text-gray-700 font-medium">Total Employer Debt</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {[
            'overview',
            'categories',
            'tasks',
            'deposits',
            'employer-credits',
            'disputes',
            'bank-accounts',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors text-sm ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Platform Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold mb-3">Quick Stats</h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Total Commission: ₦{adminStats.totalCommission.toLocaleString()}</li>
                    <li>✓ Total Employer Debt: ₦{adminStats.totalEmployerDebt.toLocaleString()}</li>
                    <li>✓ Pending Deposits: {adminStats.pendingDeposits}</li>
                    <li>✓ Pending Withdrawals: {adminStats.pendingWithdrawals}</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold mb-3">Admin Capabilities</h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Manage all categories & subcategories</li>
                    <li>✓ Review & approve/reject tasks</li>
                    <li>✓ Set worker payout rates (markup system)</li>
                    <li>✓ Manage employer credit limits</li>
                    <li>✓ Process deposits & withdrawals</li>
                    <li>✓ Resolve disputes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Categories Management */}
          {activeTab === 'categories' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Category Management</h3>
              
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-bold mb-4">Add New Category</h4>
                <form onSubmit={handleAddCategory} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="E.g., TikTok"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category Slug</label>
                    <input
                      type="text"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="tiktok"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              <h4 className="font-bold mb-4">Existing Categories</h4>
              <div className="space-y-2">
                {categories_.map((cat) => (
                  <div key={cat.id} className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{cat.name}</p>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Review */}
          {activeTab === 'tasks' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Pending Tasks Review</h3>
              <div className="space-y-4">
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-600">No tasks pending review</p>
                ) : (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="card border-l-4 border-yellow-600">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{task.title}</h4>
                          <p className="text-sm text-gray-600">By: {task.employerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          Pending
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Employer Rate</p>
                          <p className="font-bold text-lg">₦{task.employerPrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Slots</p>
                          <p className="font-bold text-lg">{task.totalSlots}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Commission Potential</p>
                          <p className="font-bold text-lg text-green-600">₦{(task.employerPrice * 0.15).toFixed(0)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveTask(task.id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                        >
                          Approve & Set Rate
                        </button>
                        <button
                          onClick={() => handleRejectTask(task.id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Deposits */}
          {activeTab === 'deposits' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Pending Deposit Approvals</h3>
              <div className="space-y-4">
                {pendingDeposits.length === 0 ? (
                  <p className="text-gray-600">No pending deposits</p>
                ) : (
                  pendingDeposits.map((deposit) => (
                    <div key={deposit.id} className="card border-l-4 border-yellow-600">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Employer</p>
                          <p className="font-bold">{deposit.employerName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Amount</p>
                          <p className="font-bold text-lg text-green-600">₦{deposit.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Bank</p>
                          <p className="font-bold">{deposit.bankName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Reference</p>
                          <p className="font-bold text-sm">{deposit.reference}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApproveDeposit(deposit.id)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                      >
                        Approve Deposit
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Employer Credits */}
          {activeTab === 'employer-credits' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Employer Credit Management</h3>
              
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-bold mb-4">Update Credit Limit</h4>
                <form onSubmit={handleUpdateCreditLimit} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Employer ID</label>
                    <input
                      type="text"
                      value={creditLimitUpdate.employerId}
                      onChange={(e) => setCreditLimitUpdate({...creditLimitUpdate, employerId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">New Credit Limit (₦)</label>
                    <input
                      type="number"
                      value={creditLimitUpdate.newLimit}
                      onChange={(e) => setCreditLimitUpdate({...creditLimitUpdate, newLimit: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      min="300"
                      max="10000"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update Credit Limit
                  </button>
                </form>
              </div>

              <h4 className="font-bold mb-4">Employers with Outstanding Debt</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Employer</th>
                      <th className="px-4 py-3 text-left font-semibold">Outstanding Debt</th>
                      <th className="px-4 py-3 text-left font-semibold">Credit Limit</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerCredits.map((emp) => (
                      <tr key={emp.id} className="border-t">
                        <td className="px-4 py-3">{emp.name}</td>
                        <td className="px-4 py-3 font-bold text-red-600">₦{emp.debt.toLocaleString()}</td>
                        <td className="px-4 py-3">₦{emp.creditLimit.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                            BLOCKED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Disputes */}
          {activeTab === 'disputes' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Dispute Resolution Center</h3>
              <div className="space-y-4">
                {disputes.length === 0 ? (
                  <p className="text-gray-600">No active disputes</p>
                ) : (
                  disputes.map((dispute) => (
                    <div key={dispute.id} className="card border-l-4 border-red-600">
                      <div className="mb-3">
                        <p className="font-bold">{dispute.workerName} vs {dispute.employerName}</p>
                        <p className="text-sm text-gray-600">{dispute.reason}</p>
                      </div>
                      <button
                        onClick={() => handleResolveDispute(dispute.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                      >
                        Review & Resolve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Bank Accounts */}
          {activeTab === 'bank-accounts' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Platform Bank Accounts</h3>
              
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-bold mb-4">Add New Bank Account</h4>
                <form onSubmit={handleAddBankAccount} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={newBankAccount.bankName}
                      onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="GTBank"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Account Number</label>
                    <input
                      type="text"
                      value={newBankAccount.accountNumber}
                      onChange={(e) => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Account Name</label>
                    <input
                      type="text"
                      value={newBankAccount.accountName}
                      onChange={(e) => setNewBankAccount({...newBankAccount, accountName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Account
                  </button>
                </form>
              </div>

              <h4 className="font-bold mb-4">Active Platform Accounts</h4>
              <div className="space-y-3">
                {depositAccounts.map((account) => (
                  <div key={account.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{account.bankName}</p>
                        <p className="text-sm text-gray-600">{account.accountName}</p>
                        <p className="font-mono text-sm mt-1">{account.accountNumber}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
