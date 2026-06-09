import axios, { type AxiosError } from 'axios'

import { ACCESS_TOKEN_STORAGE_KEY } from '@/constants/auth'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export type ApiError<T = null> = AxiosError<ApiResponse<T>>

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  // TODO: 인증 구현 후 실제 토큰 저장 방식에 맞춰 교체
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  const isDevToken = import.meta.env.DEV && accessToken?.startsWith('dev-')

  if (accessToken && !isDevToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export default api
