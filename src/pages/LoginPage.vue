<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ACCESS_TOKEN_STORAGE_KEY,
  ADMIN_ROLE,
  REFRESH_TOKEN_STORAGE_KEY,
  SALES_ROLE,
  USER_BRANCH_STORAGE_KEY,
  USER_ID_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
  USER_REGION_STORAGE_KEY,
  USER_ROLE_STORAGE_KEY,
  type UserRole,
} from '../constants/auth'

const router = useRouter()
const isDev = import.meta.env.DEV

const enterAsDevRole = (role: UserRole) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, `dev-${role.toLowerCase()}-token`)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, `dev-${role.toLowerCase()}-refresh-token`)
  localStorage.setItem(USER_ID_STORAGE_KEY, role === ADMIN_ROLE ? '9000001' : '1000001')
  localStorage.setItem(USER_ROLE_STORAGE_KEY, role)
  localStorage.setItem(USER_NAME_STORAGE_KEY, role === ADMIN_ROLE ? '홍길동' : '김설계')
  localStorage.setItem(USER_REGION_STORAGE_KEY, '')
  localStorage.setItem(USER_BRANCH_STORAGE_KEY, role === ADMIN_ROLE ? '강남지점' : '')

  router.push(role === ADMIN_ROLE ? '/admin/dashboard' : '/sales/dashboard')
}
</script>

<template>
  <main class="login-page">
    <section class="login-page__panel">
      <h1>LifeGuardian</h1>
      <h2>로그인</h2>

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
