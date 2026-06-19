<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'
import AppSidebar from '@/components/common/Sidebar.vue'
import UserInfoGrid from '@/components/userDetail/UserInfoGrid.vue'
import UserProfileCard from '@/components/userDetail/UserProfileCard.vue'
import UserRecommendationCard from '@/components/userDetail/UserRecommendationCard.vue'
import UserScriptCard from '@/components/userDetail/UserScriptCard.vue'
import { getUserDetail, type UserDetail } from '@/api/userDetail'
import {
  buildChildInfo,
  buildGuardianInfo,
  resolveDetailConversionStatusCode,
  resolveReportUrl,
} from '@/utils/userDetail'

const route = useRoute()
const router = useRouter()

const user = ref<UserDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const customerId = computed(() => Number(route.params.customerId))
const conversionStatusCode = computed(() => String(route.query.conversionStatusCode ?? ''))
const resolvedConversionStatusCode = computed(() =>
  resolveDetailConversionStatusCode(user.value, conversionStatusCode.value),
)
const isPotentialCustomer = computed(() => resolvedConversionStatusCode.value === '01')
const reportUrl = computed(() => resolveReportUrl(user.value))
const childInfo = computed(() => buildChildInfo(user.value, isPotentialCustomer.value))
const guardianInfo = computed(() => buildGuardianInfo(user.value))

const goSalesList = () => {
  void router.push('/sales')
}

const openReport = () => {
  if (!reportUrl.value) return
  window.open(reportUrl.value, '_blank', 'noopener,noreferrer')
}

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? '고객 정보를 불러오지 못했습니다.'
  }

  return '고객 정보를 불러오지 못했습니다.'
}

const loadUser = async () => {
  isLoading.value = true
  errorMessage.value = ''
  user.value = null

  if (!Number.isInteger(customerId.value) || customerId.value <= 0) {
    errorMessage.value = '유효하지 않은 고객 번호입니다.'
    isLoading.value = false
    return
  }

  if (!conversionStatusCode.value) {
    errorMessage.value = '고객 구분 정보가 없습니다.'
    isLoading.value = false
    return
  }

  try {
    user.value = await getUserDetail(customerId.value, conversionStatusCode.value)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [route.params.customerId, route.query.conversionStatusCode],
  () => {
    void loadUser()
  },
  { immediate: true },
)
</script>

<template>
  <div class="app-shell user-detail-shell">
    <AppSidebar active-label="영업현황" />

    <main class="app-main user-detail-page">
      <AppHeader title="고객 상세" />

      <div class="detail-toolbar">
        <button class="back-button" type="button" @click="goSalesList">← 영업현황</button>
        <button class="report-button" type="button" :disabled="!reportUrl" @click="openReport">
          생활주기 성장 리포트 보기
        </button>
      </div>

      <section v-if="isLoading" class="detail-state card">고객 정보를 불러오는 중입니다.</section>
      <section v-else-if="errorMessage" class="detail-state detail-state--error card">
        <strong>{{ errorMessage }}</strong>
        <button class="button button-secondary" type="button" @click="goSalesList">목록으로 돌아가기</button>
      </section>

      <div v-else-if="user" class="detail-content">
        <UserProfileCard :user="user" :is-potential-customer="isPotentialCustomer" />
        <UserInfoGrid :child-info="childInfo" :guardian-info="guardianInfo" />
        <UserRecommendationCard />
        <UserScriptCard />
      </div>
    </main>
  </div>
</template>

<style scoped>
.user-detail-shell {
  background: #f4f7fb;
}

.user-detail-page {
  padding: 16px 28px 48px 25px;
  overflow-x: hidden;
}

.detail-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 14px;
}

.back-button {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  padding: 0;
  font-size: 12px;
  font-weight: 800;
}

.report-button {
  min-height: 34px;
  border: 0;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 800;
}

.report-button:disabled {
  background: #b9c1cf;
}

.detail-content {
  display: grid;
  gap: 14px;
}

.detail-state {
  display: grid;
  min-height: 240px;
  place-items: center;
  color: var(--color-text-muted);
}

.detail-state--error {
  align-content: center;
  gap: 14px;
  color: #d85a65;
}

@media (max-width: 640px) {
  .user-detail-page {
    padding: 16px;
  }

  .detail-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .report-button {
    width: 100%;
  }
}

</style>
