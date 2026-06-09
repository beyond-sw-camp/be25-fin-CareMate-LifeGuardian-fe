<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_BRANCH_STORAGE_KEY,
  USER_ID_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
  USER_REGION_STORAGE_KEY,
  USER_ROLE_STORAGE_KEY,
} from '../../constants/auth'

const props = defineProps<{
  title: string
  description?: string
}>()

const router = useRouter()

const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_ID_STORAGE_KEY)
  localStorage.removeItem(USER_ROLE_STORAGE_KEY)
  localStorage.removeItem(USER_NAME_STORAGE_KEY)
  localStorage.removeItem(USER_REGION_STORAGE_KEY)
  localStorage.removeItem(USER_BRANCH_STORAGE_KEY)
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__title">
      <h2 class="page-title">{{ props.title }}</h2>
      <p v-if="props.description" class="page-description">{{ props.description }}</p>
    </div>

    <div class="app-header__user">
      <button class="app-header__logout" type="button" @click="logout">로그아웃</button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 54px;
  margin-bottom: 16px;
}

.app-header__title {
  display: grid;
  gap: 2px;
}

.app-header__user {
  display: flex;
  align-items: center;
  min-width: 0;
}

.app-header__logout {
  min-height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
  color: #334155;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 800;
}

.app-header__logout:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

@media (max-width: 760px) {
  .app-header {
    align-items: stretch;
    flex-direction: column;
  }

  .app-header__user {
    justify-content: space-between;
  }
}
</style>
