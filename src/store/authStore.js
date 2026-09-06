import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with backend
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          set({ user: data.user, isAuthenticated: true })
        } else {
          localStorage.removeItem('token')
          set({ user: null, token: null, isAuthenticated: false })
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
      }
    }
  },
}))