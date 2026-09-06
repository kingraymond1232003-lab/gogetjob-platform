import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
}

export const jobsAPI = {
  getJobs: (filters = {}) => api.get('/jobs', { params: filters }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
}

export const submissionsAPI = {
  submitProof: (jobId, data) => api.post(`/jobs/${jobId}/submit`, data),
  getSubmissions: (jobId) => api.get(`/jobs/${jobId}/submissions`),
  approveSubmission: (submissionId) => api.post(`/submissions/${submissionId}/approve`),
  rejectSubmission: (submissionId, reason) => api.post(`/submissions/${submissionId}/reject`, { reason }),
  requestRetry: (submissionId, notes) => api.post(`/submissions/${submissionId}/retry`, { notes }),
  disputeRejection: (submissionId) => api.post(`/submissions/${submissionId}/dispute`),
}

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getBalance: () => api.get('/users/balance'),
  getReferralCode: () => api.get('/users/referral'),
}

export const withdrawalAPI = {
  requestBankWithdrawal: (data) => api.post('/withdrawals/bank', data),
  requestAirtimeWithdrawal: (data) => api.post('/withdrawals/airtime', data),
  getWithdrawalHistory: () => api.get('/withdrawals/history'),
  getWithdrawalStatus: () => api.get('/withdrawals/status'),
}

export const depositAPI = {
  getDepositAccounts: () => api.get('/deposits/accounts'),
  requestDeposit: (data) => api.post('/deposits/request', data),
  getDepositHistory: () => api.get('/deposits/history'),
}

export const adminAPI = {
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  getSubcategories: (categoryId) => api.get(`/admin/categories/${categoryId}/subcategories`),
  createSubcategory: (categoryId, data) => api.post(`/admin/categories/${categoryId}/subcategories`, data),
  updateSubcategory: (id, data) => api.put(`/admin/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/admin/subcategories/${id}`),
  
  getTasksForReview: () => api.get('/admin/tasks/pending'),
  approveTask: (taskId, workerRate) => api.post(`/admin/tasks/${taskId}/approve`, { workerRate }),
  rejectTask: (taskId, reason) => api.post(`/admin/tasks/${taskId}/reject`, { reason }),
  
  getDepositRequests: () => api.get('/admin/deposits/pending'),
  approveDeposit: (depositId) => api.post(`/admin/deposits/${depositId}/approve`),
  rejectDeposit: (depositId, reason) => api.post(`/admin/deposits/${depositId}/reject`, { reason }),
  
  getWithdrawalRequests: () => api.get('/admin/withdrawals/pending'),
  processWithdrawal: (withdrawalId) => api.post(`/admin/withdrawals/${withdrawalId}/process`),
  
  getEmployerCredits: () => api.get('/admin/employer-credits'),
  updateEmployerCreditLimit: (userId, newLimit) => api.put(`/admin/employers/${userId}/credit-limit`, { newLimit }),
  
  getDisputes: () => api.get('/admin/disputes'),
  resolveDispute: (disputeId, data) => api.post(`/admin/disputes/${disputeId}/resolve`, data),
  
  getRevenueLedger: () => api.get('/admin/revenue'),
  getAdminStats: () => api.get('/admin/stats'),
}

export default api