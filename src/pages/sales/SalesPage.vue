<script setup lang="ts">
import axios from 'axios'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppHeader from '../../components/common/Header.vue'
import AppSidebar from '../../components/common/Sidebar.vue'
import SalesPagination from '../../components/sales/SalesPagination.vue'
import SalesSearchForm from '../../components/sales/SalesSearchForm.vue'
import SalesSummary from '../../components/sales/SalesSummary.vue'
import SalesTable from '../../components/sales/SalesTable.vue'
import {
  getSalesList,
  getSalesSummary,
  resolveSalesCustomerStageCode,
  sendCustomerReport,
  sendCustomerReportsInBulk,
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
const reportMessage = ref('')
const reportMessageType = ref<'success' | 'error'>('success')
const sendingCustomerIds = ref<number[]>([])
const isBulkSending = ref(false)
const filters = ref<SalesSearchFilters>({})
const activeCustomerType = ref<'' | '01' | '02'>('')
let reportMessageTimer: ReturnType<typeof setTimeout> | undefined

const customerTypeTabs = [
  { label: '전체', value: '' },
  { label: '잠재', value: '01' },
  { label: '통합', value: '02' },
] as const

const customerStageMatches = (customer: SalesCustomer, stageCode: '01' | '02') => {
  return resolveSalesCustomerStageCode(customer) === stageCode
}

const displayedCustomers = computed(() => {
  const customerStageCode = activeCustomerType.value
  const contractStatusCodes = filters.value.contractStatusCodes

  return customers.value.filter((customer) => {
    if (customerStageCode && !customerStageMatches(customer, customerStageCode)) {
      return false
    }

    if (contractStatusCodes?.length && !customerStageMatches(customer, '02')) {
      return false
    }

    if (
      contractStatusCodes?.length &&
      !contractStatusCodes.includes(customer.contractStatusCode ?? '')
    ) {
      return false
    }

    return true
  })
})

const displayedTotalCount = computed(() =>
  activeCustomerType.value || filters.value.contractStatusCodes?.length
    ? displayedCustomers.value.length
    : totalCount.value,
)

// KPI API가 요구하는 yyyyMM 형식으로 현재 연월을 생성
const currentYearMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Axios 응답에 서버 메시지가 있으면 화면 오류 문구로 우선 사용
const getErrorMessage = (error: unknown, fallbackMessage = '영업현황을 불러오지 못했습니다.') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallbackMessage
  }

  return fallbackMessage
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
  if (nextFilters.contractStatusCodes?.length) {
    activeCustomerType.value = '02'
  }
  void loadSalesList(1)
}

const handleCustomerTypeChange = (value: '' | '01' | '02') => {
  activeCustomerType.value = value
}

const showReportMessage = (message: string, type: 'success' | 'error') => {
  if (reportMessageTimer) clearTimeout(reportMessageTimer)

  reportMessage.value = message
  reportMessageType.value = type
  reportMessageTimer = setTimeout(() => {
    reportMessage.value = ''
    reportMessageTimer = undefined
  }, 7_000)
}

const handleSendReport = async (customer: SalesCustomer) => {
  if (sendingCustomerIds.value.includes(customer.customerId)) return

  const isResend = customer.reportStatusCode === '02'
  if (
    !window.confirm(
      `${customer.customerName} 고객의 리포트를 ${isResend ? '재발송' : '발송'}하시겠습니까?`,
    )
  ) {
    return
  }

  sendingCustomerIds.value = [...sendingCustomerIds.value, customer.customerId]
  reportMessage.value = ''

  try {
    const result = await sendCustomerReport(customer.customerId)
    showReportMessage(
      `${result.customerName} 고객 리포트가 ${isResend ? '재발송' : '발송'}되었습니다.`,
      'success',
    )
    await loadSalesList()
  } catch (error) {
    showReportMessage(getErrorMessage(error, '리포트를 발송하지 못했습니다.'), 'error')
  } finally {
    sendingCustomerIds.value = sendingCustomerIds.value.filter(
      (customerId) => customerId !== customer.customerId,
    )
  }
}

const handleBulkSend = async () => {
  if (isBulkSending.value) return
  if (!window.confirm('일괄 발송하시겠습니까?')) return

  isBulkSending.value = true
  reportMessage.value = ''

  try {
    const result = await sendCustomerReportsInBulk()
    showReportMessage(
      `일괄 발송 완료: 요청 ${result.requestedCount}건, 성공 ${result.successCount}건, 실패 ${result.failedCount}건`,
      result.failedCount > 0 ? 'error' : 'success',
    )
    await loadSalesList()
  } catch (error) {
    showReportMessage(getErrorMessage(error, '리포트 일괄 발송에 실패했습니다.'), 'error')
  } finally {
    isBulkSending.value = false
  }
}

onMounted(() => {
  // 서로 독립적인 KPI와 목록 API를 동시에 호출
  void Promise.all([loadSummary(), loadSalesList(1)])
})

onBeforeUnmount(() => {
  if (reportMessageTimer) clearTimeout(reportMessageTimer)
})
</script>

<template>
  <div class="app-shell sales-page">
    <AppSidebar active-label="영업현황" />

    <main class="app-main sales-page__main">
      <AppHeader title="영업현황">
        <template #actions>
          <button
            class="button button-secondary sales-list__criteria-button"
            type="button"
            @click="isCriteriaModalOpen = true"
          >
            표시기준 안내
          </button>
        </template>
      </AppHeader>

      <SalesSummary :summary="summary" />
      <SalesSearchForm @search="handleSearch" />

      <section class="card sales-list">
        <div class="sales-list__header">
          <h3 class="sales-section-title">목록 <span class="sales-list__count">총 {{ displayedTotalCount }}건</span></h3>
          <div class="sales-list__actions">
            <div class="customer-type-tabs" aria-label="고객 유형 필터">
              <button
                v-for="tab in customerTypeTabs"
                :key="tab.value || 'all'"
                class="customer-type-tabs__button"
                :class="{ 'is-active': activeCustomerType === tab.value }"
                type="button"
                @click="handleCustomerTypeChange(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
        </div>

        <p
          v-if="reportMessage"
          class="sales-list__report-message"
          :class="`sales-list__report-message--${reportMessageType}`"
          role="status"
        >
          {{ reportMessage }}
        </p>
        <p v-if="errorMessage" class="sales-list__message sales-list__message--error">{{ errorMessage }}</p>
        <p v-else-if="isLoading" class="sales-list__message">불러오는 중...</p>
        <SalesTable
          v-else
          :customers="displayedCustomers"
          :sending-customer-ids="sendingCustomerIds"
          :is-bulk-sending="isBulkSending"
          @bulk-send="handleBulkSend"
          @send-report="handleSendReport"
        />
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
          <section class="criteria-section">
            <div class="criteria-section__title">
              <span>01</span>
              <div>
                <h4>상령일 표시</h4>
                <p>고객 정보에 표시되는 밑줄 색상입니다.</p>
              </div>
            </div>
            <div class="criteria-age-grid">
              <div class="criteria-age-card criteria-age-card--warning">
                <span class="criteria-age-card__preview">고객 정보</span>
                <div>
                  <strong>D-30 ~ D-8</strong>
                  <p>상령일 도래 예정</p>
                </div>
              </div>
              <div class="criteria-age-card criteria-age-card--near">
                <span class="criteria-age-card__preview">고객 정보</span>
                <div>
                  <strong>D-7 ~ D-Day</strong>
                  <p>우선 확인 필요</p>
                </div>
              </div>
            </div>
          </section>

          <section class="criteria-section criteria-section--steps">
            <div class="criteria-section__title">
              <span>02</span>
              <div>
                <h4>3step 배지</h4>
                <p>고객에게 필요한 보장 점검 유형입니다.</p>
              </div>
            </div>
            <div class="criteria-step criteria-step--red">
              <span class="criteria-step__badge criteria-step__badge--red"></span>
              <div>
                <strong>가족 통합 리모델링</strong>
                <span class="criteria-step__case">CASE A</span>
                <p>자녀 보장과 부모 보장을 함께 점검해야 하는 최우선 고객</p>
              </div>
            </div>
            <div class="criteria-step criteria-step--orange">
              <span class="criteria-step__badge criteria-step__badge--orange"></span>
              <div>
                <strong>자녀 보장 점검</strong>
                <span class="criteria-step__case">CASE B</span>
                <p>자녀의 연령 변화에 따라 보장 점검이 필요한 고객</p>
              </div>
            </div>
            <div class="criteria-step criteria-step--yellow">
              <span class="criteria-step__badge criteria-step__badge--yellow"></span>
              <div>
                <strong>부모 건강 점검</strong>
                <span class="criteria-step__case">CASE C</span>
                <p>보호자의 연령 변화에 따라 보장 점검이 필요한 고객</p>
              </div>
            </div>
          </section>
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

.sales-list__report-message {
  margin: 0 0 8px;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 11px;
  font-weight: 700;
}

.sales-list__report-message--success {
  background: #eaf8ee;
  color: #24723b;
}

.sales-list__report-message--error {
  background: #fff0f1;
  color: #c43e4b;
}

.sales-list__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sales-list__criteria-button {
  min-height: 28px;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 11px;
}

.customer-type-tabs {
  display: inline-flex;
  align-items: center;
  border: 1px solid #dfe5ee;
  border-radius: 8px;
  background: #f7f9fc;
  padding: 3px;
}

.customer-type-tabs__button {
  min-width: 48px;
  height: 26px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #6b7483;
  padding: 0 11px;
  font-size: 11px;
  font-weight: 850;
}

.customer-type-tabs__button:hover {
  color: #263142;
}

.customer-type-tabs__button.is-active {
  background: #ffffff;
  color: var(--color-primary);
  box-shadow: 0 1px 3px rgb(15 23 42 / 10%);
}

.sales-criteria-modal {
  z-index: 30;
}

.sales-criteria-modal__card {
  display: flex;
  width: min(560px, 100%);
  max-height: calc(100vh - 48px);
  overflow: hidden;
  border: 1px solid #e4e9f2;
  border-radius: 20px;
  background: #ffffff;
  flex-direction: column;
}

.sales-criteria-modal__header {
  position: relative;
  flex: 0 0 auto;
  border-bottom: 1px solid #e8edf5;
  background:
    radial-gradient(circle at 90% 10%, rgb(56 163 255 / 13%), transparent 40%),
    linear-gradient(135deg, #f7faff 0%, #ffffff 70%);
  padding: 24px 64px 22px 28px;
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
  position: absolute;
  top: 22px;
  right: 24px;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid #e0e6ef;
  border-radius: 10px;
  background: #ffffff;
  color: #667085;
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
}

.sales-criteria-modal__body {
  display: grid;
  min-height: 0;
  flex: 1 1 auto;
  gap: 24px;
  overflow-y: auto;
  padding: 24px 28px;
  color: #172033;
  font-size: 12px;
}

.criteria-section__title {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 14px;
}

.criteria-section__title > span {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 9px;
  background: #eaf3ff;
  color: #3783e8;
  font-size: 10px;
  font-weight: 900;
}

.criteria-section__title h4,
.criteria-section__title p,
.criteria-step p {
  margin: 0;
}

.criteria-section__title h4 {
  font-size: 14px;
  font-weight: 900;
}

.criteria-section__title p {
  margin-top: 2px;
  color: #8a93a3;
  font-size: 11px;
}

.criteria-age-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.criteria-age-card {
  display: grid;
  gap: 10px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fbfcfe;
  padding: 13px;
}

.criteria-age-card__preview {
  width: fit-content;
  color: #4b5565;
  font-size: 11px;
  font-weight: 700;
  text-decoration-line: underline;
  text-decoration-skip-ink: none;
  text-decoration-thickness: 0.62em;
  text-underline-offset: -0.3em;
}

.criteria-age-card--warning .criteria-age-card__preview {
  text-decoration-color: rgb(251 146 60 / 42%);
}

.criteria-age-card--near .criteria-age-card__preview {
  text-decoration-color: rgb(250 204 21 / 48%);
}

.criteria-age-card strong {
  display: block;
  color: #293246;
  font-size: 12px;
  font-weight: 900;
}

.criteria-age-card p {
  margin: 2px 0 0;
  color: #8a93a3;
  font-size: 10px;
}

.criteria-section--steps {
  border-top: 1px solid #edf0f5;
  padding-top: 22px;
}

.criteria-step {
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: center;
  gap: 12px;
  margin-top: 9px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fbfcfe;
  padding: 12px 13px;
}

.criteria-step__badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow:
    inset 0 2px 2px rgb(255 255 255 / 70%),
    inset 0 -3px 4px rgb(0 0 0 / 16%);
}

.criteria-step__badge--red {
  background: linear-gradient(#ff5353, #d50000);
}

.criteria-step__badge--orange {
  background: linear-gradient(#ffb338, #e77d00);
}

.criteria-step__badge--yellow {
  background: linear-gradient(#ffe948, #ffc400);
}

.criteria-step > div {
  position: relative;
  display: grid;
  gap: 2px;
  padding-right: 58px;
}

.criteria-step > div > strong {
  font-size: 12px;
  font-weight: 900;
}

.criteria-step__case {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 999px;
  background: #eef3fa;
  color: #68758a;
  padding: 3px 7px;
  font-size: 9px;
  font-weight: 900;
}

.criteria-step p:last-child {
  color: #7f8999;
  font-size: 10px;
}

.sales-criteria-modal__footer {
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  border-top: 1px solid #edf0f5;
  background: #fbfcfe;
  padding: 14px 28px 18px;
}
</style>
