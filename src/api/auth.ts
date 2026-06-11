import api, { type ApiResponse } from '@/api/instance'
import type { UserRole } from '@/constants/auth'

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  userId: number
  name: string
  role: UserRole
  isFirstLogin: boolean
}

export async function login(request: LoginRequest) {
  const response = await api.post<ApiResponse<LoginResponse>>(
    '/v1/auth/login',
    request,
  )

  return response.data.data
}
