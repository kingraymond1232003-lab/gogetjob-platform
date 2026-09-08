import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { jobsAPI, depositAPI, submissionsAPI } from '../../services/api'
import { useCategoryStore } from '../../store/categoryStore'

export default function EmployerDashboard() {
  const { user } = useAuthStore()
  const { categories, subcategories, appDataSizeTiers } = useCategoryStore()
  
  const [activeTab, setActiveTab] = useState('create-job')
  const [creditBalance, setCreditBalance] = useState({ owed: 0, limit: 300, available: 0 })
  const [jobs, setJobs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('app')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [appDataSize, setAppDataSize] = useState('')
  
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'app',
    subcategory: '',
    appDataSize: '',
    taskLink: '',
    description: '',
    proofRequired: false,
    totalSlots: 1,
    rewardPerSlot: 500,
    imageFile: null,
  })
  
  const [loading, setLoading] = useState(false)
  const [proofReviewJob, setProofReviewJob] = useState(null)
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    loadJobsAndCredit()
  }, [])

  const loadJobsAndCredit = async () => {
    try {
      const jobsRes = await jobsAPI.getJobs({ employerId: user?.id })
      setJobs(jobsRes.data)
      // Credit balance would come from backend
      setCreditBalance({ owed: 0, limit: 300, available: 300 })
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleJobFormChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setJobForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }))
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(jobForm).forEach(key => {
        if (jobForm[key]) formData.append(key, jobForm[key])
      })
      formData.append('paymentMethod', paymentMethod)
      
      await jobsAPI.createJob(formData)
      alert('Job posted successfully! Awaiting admin review.')
      setJobForm({
        title: '',
        category: 'app',
        subcategory: '',
        appDataSize: '',
        taskLink: '',
        description: '',
        proofRequired: false,
        totalSlots: 1,
        rewardPerSlot: 500,
        imageFile: null,
      })
      loadJobsAndCredit()
    } catch (error) {
      alert('Failed to create job: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveSubmission = async (submissionId) => {
    try {
      await submissionsAPI.approveSubmission(submissionId)
      alert('Submission approved!')
      loadJobsAndCredit()
    } catch (error) {
      alert('Failed to approve submission')
    }
  }

  const handleRejectSubmission = async (submissionId, reason) => {
    try {
      await submissionsAPI.rejectSubmission(submissionId, reason)
      alert('Submission rejected')
      loadJobsAndCredit()
    } catch (error) {
      alert('Failed to reject submission')
    }
  }

  const selectedCategoryObj = categories.find(c => c.slug === selectedCategory)
  const selectedSubs = selectedCategoryObj ? subcategories[selectedCategoryObj.slug] : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user?.fullName}! Manage your jobs and payments</p>
      </div>

      {/* Credit Status Card */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg mb-8 border border-orange-200">
        <h3 className="text-lg font-bold text-orange-900 mb-4">Credit Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-orange-700 text-sm mb-1">Outstanding Debt</p>
            <p className="text-3xl font-bold text-orange-600">₦{creditBalance.owed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-orange-700 text-sm mb-1">Credit Limit</p>
            <p className="text-3xl font-bold text-orange-600">₦{creditBalance.limit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-orange-700 text-sm mb-1">Available to Post</p>
            <p className="text-3xl font-bold text-green-600">₦{creditBalance.available.toLocaleString()}</p>
          </div>
        </div>
        {creditBalance.owed > 0 && (
          <div className="mt-4 p-3 bg-orange-200 text-orange-900 rounded">
            ⚠️ You have an outstanding debt. Please pay it off to post more jobs.
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {['create-job', 'manage-jobs', 'review-proofs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
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
          {/* Create Job Tab */}
          {activeTab === 'create-job' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Post a New Job</h3>
              <form onSubmit={handleCreateJob} className="max-w-2xl">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={jobForm.title}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="E.g., Download and review our app"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Main Category</label>
                    <select
                      name="category"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setJobForm(prev => ({ ...prev, category: e.target.value }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subcategory</label>
                    <select
                      name="subcategory"
                      value={selectedSubcategory}
                      onChange={(e) => {
                        setSelectedSubcategory(e.target.value)
                        setJobForm(prev => ({ ...prev, subcategory: e.target.value }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select subcategory</option>
                      {selectedSubs.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedCategory === 'app' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">App Data Size</label>
                    <select
                      name="appDataSize"
                      value={appDataSize}
                      onChange={(e) => {
                        setAppDataSize(e.target.value)
                        setJobForm(prev => ({ ...prev, appDataSize: e.target.value }))
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select data size</option>
                      {appDataSizeTiers.map((tier, idx) => (
                        <option key={idx} value={tier.size}>{tier.size} (+₦{tier.surcharge})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Task Link</label>
                  <input
                    type="url"
                    name="taskLink"
                    required
                    value={jobForm.taskLink}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Task Description</label>
                  <textarea
                    name="description"
                    required
                    value={jobForm.description}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Detailed instructions for workers"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Task Banner Image</label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    name="proofRequired"
                    id="proofRequired"
                    checked={jobForm.proofRequired}
                    onChange={handleJobFormChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="proofRequired" className="ml-2 text-gray-700 font-medium">
                    Require proof (screenshot/text submission)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Total Slots</label>
                    <input
                      type="number"
                      name="totalSlots"
                      required
                      value={jobForm.totalSlots}
                      onChange={handleJobFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Reward per Slot (₦)</label>
                    <input
                      type="number"
                      name="rewardPerSlot"
                      required
                      value={jobForm.rewardPerSlot}
                      onChange={handleJobFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      min="50"
                    />
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-gray-700 font-medium mb-3">Payment Method</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="wallet"
                        name="payment"
                        value="wallet"
                        checked={paymentMethod === 'wallet'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="wallet" className="ml-2">Pay from Wallet Balance</label>
                    </div>
                    {creditBalance.available > 0 && (
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="credit"
                          name="payment"
                          value="credit"
                          checked={paymentMethod === 'credit'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="credit" className="ml-2">Post on Credit (Available: ₦{creditBalance.available})</label>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating Job...' : 'Post Job for Review'}
                </button>
              </form>
            </div>
          )}

          {/* Manage Jobs Tab */}
          {activeTab === 'manage-jobs' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Your Jobs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Job Title</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Slots Left</th>
                      <th className="px-4 py-3 text-left font-semibold">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-gray-600">No jobs posted yet</td>
                      </tr>
                    ) : (
                      jobs.map((job) => (
                        <tr key={job.id} className="border-t">
                          <td className="px-4 py-3">{job.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              job.status === 'active' ? 'bg-green-100 text-green-800' :
                              job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{job.remainingSlots}/{job.totalSlots}</td>
                          <td className="px-4 py-3 font-semibold">₦{job.rewardPerSlot}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Review Proofs Tab */}
          {activeTab === 'review-proofs' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Review Worker Submissions</h3>
              {submissions.length === 0 ? (
                <p className="text-gray-600">No submissions to review</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="card border-l-4 border-blue-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg">{sub.jobTitle}</h4>
                          <p className="text-gray-600 text-sm">Worker: {sub.workerName}</p>
                        </div>
                      </div>
                      {sub.proofImage && (
                        <img src={sub.proofImage} alt="Proof" className="max-w-xs max-h-48 mb-4 rounded" />
                      )}
                      {sub.proofText && (
                        <p className="mb-4 p-2 bg-gray-50 rounded">{sub.proofText}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveSubmission(sub.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSubmission(sub.id, 'Does not meet requirements')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
