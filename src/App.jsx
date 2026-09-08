import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const WorkerDashboard = lazy(() => import('./pages/dashboard/WorkerDashboard'))
const EmployerDashboard = lazy(() => import('./pages/dashboard/EmployerDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function App() {
  const initialize = useAuthStore((state) => state.initialize)
  const subscribeToAuth = useAuthStore((state) => state.subscribeToAuth)

  useEffect(() => {
    initialize()
    return subscribeToAuth()
  }, [initialize, subscribeToAuth])

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

          {/* Protected Worker Routes */}
          <Route
            path="/dashboard/worker"
            element={
              <ProtectedRoute requiredRole="worker">
                <Layout><WorkerDashboard /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Employer Routes */}
          <Route
            path="/dashboard/employer"
            element={
              <ProtectedRoute requiredRole="employer">
                <Layout><EmployerDashboard /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  )
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50" role="status">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="mt-3 text-sm font-medium text-gray-600">Loading page...</p>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600 mt-2">Page not found</p>
      </div>
    </div>
  )
}

export default App
