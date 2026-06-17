<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  title: string
  description?: string
}>()

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
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
      <slot name="actions"></slot>
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
  gap: 8px;
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
