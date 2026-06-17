import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

import { ACCESS_TOKEN_STORAGE_KEY } from '@/constants/auth'
import { useAuthStore } from '@/stores/auth'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export type ApiError<T = null> = AxiosError<ApiResponse<T>>

export interface TokenReissueResponse {
  accessToken: string
}

type TokenReissueApiResponse =
  | ApiResponse<TokenReissueResponse>
  | ApiResponse<string>
  | TokenReissueResponse

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const TOKEN_REISSUE_URL = '/v1/auth/reissue'
const TOKEN_LOGOUT_URL = '/v1/auth/logout'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const tokenApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshTokenRequest: Promise<TokenReissueResponse> | null = null

const reissueToken = async () => {
  const authStore = useAuthStore()
  const accessToken = authStore.accessToken ?? sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

  refreshTokenRequest ??= tokenApi
    .post<TokenReissueApiResponse>(TOKEN_REISSUE_URL, undefined, {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    })
    .then((response) => {
      const body = response.data

      if (typeof body === 'string') {
        return { accessToken: body }
      }

      if ('accessToken' in body) {
        return body
      }

      if (typeof body.data === 'string') {
        return { accessToken: body.data }
      }

      return body.data
    })
    .finally(() => {
      refreshTokenRequest = null
    })

  return refreshTokenRequest
}

export const reissueAccessToken = async () => {
  const authStore = useAuthStore()
  const tokenInfo = await reissueToken()

  authStore.setAccessToken(tokenInfo.accessToken)

  return tokenInfo.accessToken
}

api.interceptors.request.use(async (config) => {
  const authStore = useAuthStore()
  let accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  const isDevToken = import.meta.env.DEV && accessToken?.startsWith('dev-')
  const isTokenReissueRequest = config.url === TOKEN_REISSUE_URL
  const isLoginRequest = config.url === '/v1/auth/login'
  const isLogoutRequest = config.url === TOKEN_LOGOUT_URL

  if (!accessToken && !isTokenReissueRequest && !isLoginRequest && !isLogoutRequest) {
    try {
      accessToken = await reissueAccessToken()
    } catch (error) {
      authStore.logout()

      return Promise.reject(error)
    }
  }

  if (accessToken && !isDevToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const authStore = useAuthStore()
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const isUnauthorized = error.response?.status === 401
    const isTokenReissueRequest = originalRequest?.url === TOKEN_REISSUE_URL

    if (!originalRequest || !isUnauthorized || originalRequest._retry || isTokenReissueRequest) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const accessToken = await reissueAccessToken()

      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest as AxiosRequestConfig)
    } catch (refreshError) {
      authStore.logout()

      return Promise.reject(refreshError)
    }
  },
)

export default api
