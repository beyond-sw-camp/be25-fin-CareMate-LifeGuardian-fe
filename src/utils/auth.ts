import { ADMIN_ROLE, SALES_ROLE, type UserRole } from '@/constants/auth'

const ROLE_HOME_PATHS: Record<UserRole, string> = {
  [ADMIN_ROLE]: '/admin/dashboard',
  [SALES_ROLE]: '/sales/dashboard',
}

export const getRoleHomePath = (role?: UserRole | null) => {
  if (!role) return null

  return ROLE_HOME_PATHS[role] ?? null
}

const normalizeTokenRole = (value: unknown): UserRole | null => {
  if (typeof value !== 'string') {
    return null
  }

  const role = value.replace(/^ROLE_/, '').toUpperCase()

  if (role === ADMIN_ROLE) {
    return ADMIN_ROLE
  }

  if (role === SALES_ROLE || role === 'SALES') {
    return SALES_ROLE
  }

  return null
}

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const payload = token.split('.')[1]

  if (!payload) {
    return null
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    )

    return JSON.parse(atob(paddedPayload)) as Record<string, unknown>
  } catch {
    return null
  }
}

export const getRoleFromAccessToken = (token: string): UserRole | null => {
  const payload = decodeJwtPayload(token)

  if (!payload) {
    return null
  }

  const role = normalizeTokenRole(payload.role)

  if (role) {
    return role
  }

  const roles = [payload.roles, payload.authorities].find(Array.isArray)

  return roles?.map(normalizeTokenRole).find((role) => role !== null) ?? null
}
