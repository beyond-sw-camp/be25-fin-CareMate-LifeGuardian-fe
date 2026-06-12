<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ADMIN_ROLE,
  SALES_ROLE,
  type UserRole,
} from '../constants/auth'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isDev = import.meta.env.DEV
const loginId = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const moveToRoleHome = (role: UserRole) =>
  router.push(role === ADMIN_ROLE ? '/admin/dashboard' : '/sales/dashboard')

const submitLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await login({
      loginId: loginId.value,
      password: password.value,
    })

    authStore.setLoginInfo(result)
    await moveToRoleHome(result.role)
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? error.response?.data?.message ?? '로그인에 실패했습니다.'
      : '로그인에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const enterAsDevRole = (role: UserRole) => {
  authStore.setLoginInfo({
    accessToken: `dev-${role.toLowerCase()}-token`,
    userId: role === ADMIN_ROLE ? '9000001' : '1000001',
    role,
    name: role === ADMIN_ROLE ? '홍길동' : '김설계',
    isFirstLogin: false,
    region: '',
    branch: role === ADMIN_ROLE ? '강남지점' : '',
  })

  void moveToRoleHome(role)
}
</script>

<template>
  <main class="login-page">
    <section class="login-page__panel">
      <h1>LifeGuardian</h1>
      <h2>로그인</h2>

      <form class="login-page__form" @submit.prevent="submitLogin">
        <label>
          <span>아이디</span>
          <input v-model.trim="loginId" class="input" autocomplete="username" required />
        </label>
        <label>
          <span>비밀번호</span>
          <input
            v-model="password"
            class="input"
            type="password"
            autocomplete="current-password"
            required
          />
        </label>

        <p v-if="errorMessage" class="login-page__error">{{ errorMessage }}</p>

        <button class="button button-primary" type="submit" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <div v-if="isDev" class="login-page__dev-tools">
        <p>개발용 권한 테스트</p>
        <button class="button button-primary" type="button" @click="enterAsDevRole(SALES_ROLE)">
          영업사원 화면 진입
        </button>
        <button class="button button-secondary" type="button" @click="enterAsDevRole(ADMIN_ROLE)">
          관리자 화면 진입
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  background: #f4f7fb;
}

.login-page__panel {
  width: min(360px, calc(100vw - 32px));
  border: 1px solid #e1e7f0;
  border-radius: 8px;
  background: #ffffff;
  padding: 32px;
}

.login-page h1,
.login-page h2 {
  margin: 0;
}

.login-page h1 {
  color: var(--color-primary);
  font-size: 22px;
  font-weight: 900;
}

.login-page h2 {
  margin-top: 18px;
  font-size: 18px;
}

.login-page__form {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.login-page__form label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
}

.login-page__error {
  margin: 0;
  color: var(--color-danger);
  font-size: 12px;
}

.login-page__dev-tools {
  display: grid;
  gap: 10px;
  margin-top: 24px;
  border-top: 1px solid #e5ebf5;
  padding-top: 20px;
}

.login-page__dev-tools p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
}
</style>
