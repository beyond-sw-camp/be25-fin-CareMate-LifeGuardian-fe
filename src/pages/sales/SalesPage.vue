<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import AppHeader from '../../components/common/Header.vue'
import AppSidebar from '../../components/common/Sidebar.vue'
import SalesPagination from '../../components/sales/SalesPagination.vue'
import SalesSearchForm from '../../components/sales/SalesSearchForm.vue'
import SalesSummary from '../../components/sales/SalesSummary.vue'
import SalesTable from '../../components/sales/SalesTable.vue'
import {
  getSalesList,
  getSalesSummary,
  type SalesCustomer,
  type SalesSearchFilters,
  type SalesSummary as SalesSummaryData,
} from '@/api/sales'

const isCriteriaModalOpen = ref(false)
const summary = ref<SalesSummaryData | null>(null)
const customers = ref<SalesCustomer[]>([])
const currentPage = ref(1)
const totalPages = ref(0)
const totalCount = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')
const filters = ref<SalesSearchFilters>({})

// KPI API가 요구하는 yyyyMM 형식으로 현재 연월을 생성
const currentYearMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Axios 응답에 서버 메시지가 있으면 화면 오류 문구로 우선 사용
const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? '영업현황을 불러오지 못했습니다.'
  }

  return '영업현황을 불러오지 못했습니다.'
}

// KPI 조회 실패가 목록 조회를 막지 않도록 별도로 처리
const loadSummary = async () => {
  try {
    summary.value = await getSalesSummary(currentYearMonth())
  } catch {
    summary.value = null
  }
}

// 현재 검색 조건을 유지하면서 요청한 페이지의 목록을 조회
const loadSalesList = async (page = currentPage.value) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await getSalesList({
      ...filters.value,
      page,
      size: 10,
    })
    customers.value = result.items
    currentPage.value = result.page
    totalPages.value = result.totalPages
    totalCount.value = result.totalCount
  } catch (error) {
    customers.value = []
    totalPages.value = 0
    totalCount.value = 0
    errorMessage.value = getErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

// 새 검색을 실행하면 첫 페이지부터 다시 조회
const handleSearch = (nextFilters: SalesSearchFilters) => {
  filters.value = nextFilters
  void loadSalesList(1)
}

onMounted(() => {
  // 서로 독립적인 KPI와 목록 API를 동시에 호출
  void Promise.all([loadSummary(), loadSalesList(1)])
})
</script>

<template>
  <div class="app-shell sales-page">
    <AppSidebar active-label="영업현황" />

    <main class="app-main sales-page__main">
      <AppHeader title="영업현황" />

      <SalesSummary :summary="summary" />
      <SalesSearchForm @search="handleSearch" />

      <section class="card sales-list">
        <div class="sales-list__header">
          <h3 class="sales-section-title">목록 <span class="sales-list__count">총 {{ totalCount }}건</span></h3>
          <div class="sales-list__actions">
            <button
              class="button button-secondary sales-list__criteria-button"
              type="button"
              @click="isCriteriaModalOpen = true"
            >
              표시기준 안내
            </button>
            <button class="button button-primary sales-list__bulk-button" type="button">일괄 발송</button>
          </div>
        </div>

        <p v-if="errorMessage" class="sales-list__message sales-list__message--error">{{ errorMessage }}</p>
        <p v-else-if="isLoading" class="sales-list__message">불러오는 중...</p>
        <SalesTable v-else :customers="customers" />
        <SalesPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="loadSalesList"
        />
      </section>
    </main>

    <div
      v-if="isCriteriaModalOpen"
      class="modal-backdrop sales-criteria-modal"
      role="presentation"
      @click.self="isCriteriaModalOpen = false"
    >
      <section class="modal-card sales-criteria-modal__card" role="dialog" aria-modal="true" aria-labelledby="criteria-modal-title">
        <header class="sales-criteria-modal__header">
          <div>
            <p class="sales-criteria-modal__eyebrow">영업현황</p>
            <h3 id="criteria-modal-title">표시기준 안내</h3>
          </div>
          <button class="sales-criteria-modal__close" type="button" aria-label="닫기" @click="isCriteriaModalOpen = false">
            x
          </button>
        </header>

        <div class="sales-criteria-modal__body">
          <p>목록의 고객 단계와 계약 현황은 상담 및 계약 진행 상태를 기준으로 표시됩니다.</p>
          <ul>
            <li><strong>잠재 고객</strong>은 상담 전이거나 기본 정보만 등록된 고객입니다.</li>
            <li><strong>상담중/설계중</strong>은 계약 검토가 진행 중인 상태입니다.</li>
            <li><strong>청약중/청약완료</strong>는 청약 진행 여부를 기준으로 표시됩니다.</li>
          </ul>
        </div>

        <footer class="sales-criteria-modal__footer">
          <button class="button button-primary" type="button" @click="isCriteriaModalOpen = false">확인</button>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.sales-page__main {
  padding: 16px 28px 8px 25px;
  overflow-x: hidden;
}

.sales-list {
  padding: 13px 17px 6px;
}

.sales-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.sales-section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0;
}

.sales-list__count {
  margin-left: 5px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
}

.sales-list__message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 110px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.sales-list__message--error {
  color: #d85a65;
}

.sales-list__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sales-list__bulk-button,
.sales-list__criteria-button {
  min-height: 26px;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 11px;
}

.sales-criteria-modal {
  z-index: 30;
}

.sales-criteria-modal__card {
  overflow: hidden;
}

.sales-criteria-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #f0e6d0;
  padding: 20px 22px 16px;
}

.sales-criteria-modal__eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
}

.sales-criteria-modal__header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 19px;
  font-weight: 900;
  letter-spacing: 0;
}

.sales-criteria-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: #f6eddc;
  color: #5f4b2b;
  font-size: 16px;
  font-weight: 900;
}

.sales-criteria-modal__body {
  display: grid;
  gap: 12px;
  padding: 18px 22px 6px;
  color: #34302a;
  font-size: 13px;
}

.sales-criteria-modal__body p,
.sales-criteria-modal__body ul {
  margin: 0;
}

.sales-criteria-modal__body ul {
  display: grid;
  gap: 8px;
  padding-left: 18px;
}

.sales-criteria-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding: 18px 22px 22px;
}
</style>