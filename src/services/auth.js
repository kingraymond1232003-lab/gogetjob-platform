import { AuthError, MissingIdentityError } from '@netlify/identity'

const ACCOUNT_ROLES = new Set(['worker', 'employer'])

export function normalizeIdentityUser(identityUser) {
  if (!identityUser) return null

  const metadata = identityUser.userMetadata || {}
  const assignedRoles = [identityUser.role, ...(identityUser.roles || [])]
  const metadataRole = ACCOUNT_ROLES.has(metadata.role) ? metadata.role : 'worker'
  const role = assignedRoles.includes('admin') ? 'admin' : metadataRole

  return {
    id: identityUser.id,
    email: identityUser.email || '',
    fullName: identityUser.name || metadata.full_name || identityUser.email?.split('@')[0] || 'User',
    phoneNumber: metadata.phone_number || '',
    role,
  }
}

export function getAuthErrorMessage(error, action = 'Authentication') {
  if (error instanceof MissingIdentityError) {
    return 'Account services are temporarily unavailable. Please try again shortly.'
  }

  if (error instanceof AuthError) {
    switch (error.status) {
      case 401:
        return 'Invalid email or password.'
      case 403:
        return action === 'Registration'
          ? 'New account registration is currently unavailable.'
          : 'This account is not allowed to sign in.'
      case 404:
        return 'No account was found for that email address.'
      case 422:
        return action === 'Registration'
          ? 'Please use a valid email and a password with at least 8 characters.'
          : 'Please check the information you entered.'
      case 429:
        return 'Too many attempts. Please wait a moment and try again.'
      default:
        return error.message || `${action} failed. Please try again.`
    }
  }

  return `${action} failed. Please try again.`
}

export function getDashboardPath(role) {
  if (role === 'admin') return '/admin'
  if (role === 'employer') return '/dashboard/employer'
  return '/dashboard/worker'
}
