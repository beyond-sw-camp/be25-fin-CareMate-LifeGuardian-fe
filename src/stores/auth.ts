import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  ACCESS_TOKEN_STORAGE_KEY,
  IS_FIRST_LOGIN_STORAGE_KEY,
  USER_BRANCH_STORAGE_KEY,
  USER_ID_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
  USER_REGION_STORAGE_KEY,
  USER_ROLE_STORAGE_KEY,
  type UserRole,
} from '@/constants/auth'

export interface LoginInfo {
  accessToken: string
  userId: string | number
  role: UserRole
  name: string
  isFirstLogin: boolean
  branch?: string
  region?: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY))
  const userId = ref(localStorage.getItem(USER_ID_STORAGE_KEY))
  const role = ref(localStorage.getItem(USER_ROLE_STORAGE_KEY) as UserRole | null)
  const name = ref(localStorage.getItem(USER_NAME_STORAGE_KEY))
  const isFirstLogin = ref(localStorage.getItem(IS_FIRST_LOGIN_STORAGE_KEY) === 'true')
  const branch = ref(localStorage.getItem(USER_BRANCH_STORAGE_KEY))
  const region = ref(localStorage.getItem(USER_REGION_STORAGE_KEY))

  const isAuthenticated = computed(() => Boolean(accessToken.value && role.value))

  const setLoginInfo = (loginInfo: LoginInfo) => {
    accessToken.value = loginInfo.accessToken
    userId.value = String(loginInfo.userId)
    role.value = loginInfo.role
    name.value = loginInfo.name
    isFirstLogin.value = loginInfo.isFirstLogin
    branch.value = loginInfo.branch ?? ''
    region.value = loginInfo.region ?? ''

    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, loginInfo.accessToken)
    localStorage.setItem(USER_ID_STORAGE_KEY, String(loginInfo.userId))
    localStorage.setItem(USER_ROLE_STORAGE_KEY, loginInfo.role)
    localStorage.setItem(USER_NAME_STORAGE_KEY, loginInfo.name)
    localStorage.setItem(IS_FIRST_LOGIN_STORAGE_KEY, String(loginInfo.isFirstLogin))
    localStorage.setItem(USER_BRANCH_STORAGE_KEY, loginInfo.branch ?? '')
    localStorage.setItem(USER_REGION_STORAGE_KEY, loginInfo.region ?? '')
  }

  const setAccessToken = (token: string) => {
    accessToken.value = token
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
  }

  const logout = () => {
    accessToken.value = null
    userId.value = null
    role.value = null
    name.value = null
    isFirstLogin.value = false
    branch.value = null
    region.value = null

    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_ID_STORAGE_KEY)
    localStorage.removeItem(USER_ROLE_STORAGE_KEY)
    localStorage.removeItem(USER_NAME_STORAGE_KEY)
    localStorage.removeItem(IS_FIRST_LOGIN_STORAGE_KEY)
    localStorage.removeItem(USER_BRANCH_STORAGE_KEY)
    localStorage.removeItem(USER_REGION_STORAGE_KEY)
  }

  return {
    accessToken,
    userId,
    role,
    name,
    isFirstLogin,
    branch,
    region,
    isAuthenticated,
    setLoginInfo,
    setAccessToken,
    logout,
  }
})
