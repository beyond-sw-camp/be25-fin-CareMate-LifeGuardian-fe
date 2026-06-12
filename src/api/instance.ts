import axios, { type AxiosError } from 'axios'

import { useAuthStore } from '@/stores/auth'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export type ApiError<T = null> = AxiosError<ApiResponse<T>>

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const accessToken = authStore.accessToken
  const isDevToken = import.meta.env.DEV && accessToken?.startsWith('dev-')

  if (accessToken && !isDevToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export default api
