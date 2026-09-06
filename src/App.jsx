import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WorkerDashboard from './pages/dashboard/WorkerDashboard'
import EmployerDashboard from './pages/dashboard/EmployerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
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
    </Router>
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