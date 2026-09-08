import { create } from 'zustand'
import {
  getUser,
  handleAuthCallback,
  logout as identityLogout,
  onAuthChange,
} from '@netlify/identity'
import { getAuthErrorMessage, normalizeIdentityUser } from '../services/auth'

let initializationPromise = null

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
  authError: '',

  setIdentityUser: (identityUser) => {
    const user = normalizeIdentityUser(identityUser)
    set({ user, isAuthenticated: Boolean(user), authError: '' })
    return user
  },

  initialize: async () => {
    if (get().isAuthReady) return get().user
    if (initializationPromise) return initializationPromise

    initializationPromise = (async () => {
      try {
        const callback = await handleAuthCallback()
        const identityUser = callback?.user || (await getUser())
        return get().setIdentityUser(identityUser)
      } catch (error) {
        set({ user: null, isAuthenticated: false, authError: getAuthErrorMessage(error) })
        return null
      } finally {
        set({ isAuthReady: true })
        initializationPromise = null
      }
    })()

    return initializationPromise
  },

  subscribeToAuth: () =>
    onAuthChange((_event, identityUser) => {
      get().setIdentityUser(identityUser)
      set({ isAuthReady: true })
    }),

  logout: async () => {
    try {
      await identityLogout()
    } finally {
      set({ user: null, isAuthenticated: false, authError: '' })
    }
  },
}))
