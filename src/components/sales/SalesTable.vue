<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  resolveSalesCustomerStageCode,
  resolveSalesCustomerStageName,
  type SalesCustomer,
} from '@/api/sales'

const props = defineProps<{
  customers: SalesCustomer[]
  sendingCustomerIds?: number[]
  isBulkSending?: boolean
}>()

const emit = defineEmits<{
  bulkSend: []
  sendReport: [customer: SalesCustomer]
}>()

const SENDABLE_REPORT_STATUS_CODES = new Set(['01', '02', '03'])
const selectedCustomerIds = ref<number[]>([])
const selectAllCheckbox = ref<HTMLInputElement | null>(null)

const isSending = (customerId: number) => props.sendingCustomerIds?.includes(customerId) ?? false
const canShowSendButton = (customer: SalesCustomer) =>
  customer.hasReport &&
  Boolean(customer.reportStatusCode) &&
  SENDABLE_REPORT_STATUS_CODES.has(customer.reportStatusCode!) &&
  (customer.canSendReport || customer.reportStatusCode === '02')
const sendButtonLabel = (customer: SalesCustomer) => {
  if (isSending(customer.customerId)) return '발송 중'
  return customer.reportStatusCode === '02' ? '재발송' : '발송'
}

const isAllSelected = computed(
  () =>
    props.customers.length > 0 &&
    props.customers.every((customer) => selectedCustomerIds.value.includes(customer.customerId)),
)
const isPartiallySelected = computed(
  () => selectedCustomerIds.value.length > 0 && !isAllSelected.value,
)

const toggleAllCustomers = () => {
  selectedCustomerIds.value = isAllSelected.value
    ? []
    : props.customers.map((customer) => customer.customerId)
}

watch(
  () => props.customers,
  (customers) => {
    const visibleCustomerIds = new Set(customers.map((customer) => customer.customerId))
    selectedCustomerIds.value = selectedCustomerIds.value.filter((customerId) =>
      visibleCustomerIds.has(customerId),
    )
  },
)

watch(
  isPartiallySelected,
  (isIndeterminate) => {
    if (selectAllCheckbox.value) {
      selectAllCheckbox.value.indeterminate = isIndeterminate
    }
  },
  { immediate: true },
)

const genderLabel = (gender: string) => {
  if (gender === 'MALE' || gender === 'Male' || gender === 'M' || gender === '남') return '남'
  if (gender === 'FEMALE' || gender === 'Female' || gender === 'F' || gender === '여') return '여'
  return gender
}

const contractClass = (statusCode?: string) => {
  const classMap: Record<string, string> = {
    '01': 'warning',
    '02': 'blue',
    '03': 'success',
    '04': 'danger',
    '05': 'muted',
  }

  return statusCode ? classMap[statusCode] ?? 'muted' : 'danger-soft'
}

const calculateAgeShiftDDay = (ageShiftDate?: string) => {
  if (!ageShiftDate) return undefined

  const targetDate = new Date(`${ageShiftDate}T00:00:00`)
  if (Number.isNaN(targetDate.getTime())) return undefined

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Math.ceil((targetDate.getTime() - today.getTime()) / 86_400_000)
}

const ageShiftRowClass = (ageShiftDate?: string) => {
  const dDay = calculateAgeShiftDDay(ageShiftDate)
  if (dDay === undefined || dDay < 0 || dDay > 30) return undefined
  return dDay <= 7 ? 'sales-table__row--age-shift-near' : 'sales-table__row--age-shift-warning'
}

const ageShiftGuide = (ageShiftDate?: string) => {
  const dDay = calculateAgeShiftDDay(ageShiftDate)
  if (dDay === undefined || dDay < 0 || dDay > 30) return undefined
  if (dDay === 0) return '상령일 도래 D-Day'
  return dDay <= 7 ? `상령일 임박 D-${dDay}` : `상령일 도래 예정 D-${dDay}`
}

const stepClass = (sortRank: number) => (sortRank === 1 ? 'danger' : 'warning')
</script>

<template>
  <div class="sales-table">
    <table>
      <thead>
        <tr>
          <th>
            <input
              ref="selectAllCheckbox"
              type="checkbox"
              :checked="isAllSelected"
              :disabled="customers.length === 0"
              aria-label="현재 목록 전체 선택"
              @change="toggleAllCustomers"
            />
          </th>
          <th>고객명</th>
          <th>성별</th>
          <th>만 나이</th>
          <th>생년월일</th>
          <th>3step</th>
          <th>고객 단계</th>
          <th>계약 현황</th>
          <th>보험명</th>
          <th>피보험자</th>
          <th>납입 회수일</th>
          <th>리포트 발송상태</th>
          <th>
            <button
              class="report-button report-button--bulk"
              type="button"
              :disabled="customers.length === 0 || isBulkSending"
              @click="emit('bulkSend')"
            >
              {{ isBulkSending ? '일괄 발송 중' : '일괄 발송' }}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="customer in customers"
          :key="customer.customerId"
          :class="ageShiftRowClass(customer.insuranceAgeShiftDate)"
        >
          <td>
            <input
              v-model="selectedCustomerIds"
              type="checkbox"
              :value="customer.customerId"
              :aria-label="`${customer.customerName} 선택`"
            />
          </td>
          <td>
            <RouterLink
              class="customer-name"
              :class="{ 'customer-name--age-shift': ageShiftGuide(customer.insuranceAgeShiftDate) }"
              :tabindex="ageShiftGuide(customer.insuranceAgeShiftDate) ? 0 : undefined"
              :to="{
                name: 'user-detail',
                params: { customerId: customer.customerId },
                query: { conversionStatusCode: resolveSalesCustomerStageCode(customer) },
              }"
            >
              {{ customer.customerName }}
              <span
                v-if="ageShiftGuide(customer.insuranceAgeShiftDate)"
                class="customer-name__tooltip"
                role="tooltip"
              >
                {{ ageShiftGuide(customer.insuranceAgeShiftDate) }}
              </span>
            </RouterLink>
          </td>
          <td>{{ genderLabel(customer.gender) }}</td>
          <td>{{ customer.age }}</td>
          <td>{{ customer.birthDate }}</td>
          <td>
            <span
              v-if="customer.threeStepCode || customer.sortRank === 1"
              class="step-dot"
              :class="`step-dot--${stepClass(customer.sortRank)}`"
              :title="customer.threeStepName"
            ></span>
            <span v-else>-</span>
          </td>
          <td>{{ resolveSalesCustomerStageName(customer) }}</td>
          <td>
            <span class="contract-badge" :class="`contract-badge--${contractClass(customer.contractStatusCode)}`">
              {{ customer.contractStatusName }}
            </span>
          </td>
          <td>{{ customer.insuranceName }}</td>
          <td>{{ customer.insuredName }}</td>
          <td>{{ customer.webformReceivedAt }}</td>
          <td class="report-status">{{ customer.reportStatusName }}</td>
          <td>
            <button
              class="report-button"
              :class="{ 'report-button--disabled': !canShowSendButton(customer) }"
              type="button"
              :disabled="!canShowSendButton(customer) || isSending(customer.customerId)"
              @click="emit('sendReport', customer)"
            >
              {{ canShowSendButton(customer) ? sendButtonLabel(customer) : '발송' }}
            </button>
          </td>
        </tr>
        <tr v-if="customers.length === 0">
          <td class="sales-table__empty" colspan="13">조회된 영업현황이 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sales-table {
  overflow: visible;
  border: 1px solid #dfe4ec;
}

.sales-table table {
  table-layout: fixed;
}

.sales-table th,
.sales-table td {
  height: 38px;
  border-bottom: 1px solid #e7ebf1;
  padding: 0 10px;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
}

.sales-table th {
  height: 34px;
  background: #eef1f6;
  font-weight: 800;
}

.sales-table tr:last-child td {
  border-bottom: 0;
}

.sales-table .sales-table__empty {
  height: 80px;
  color: var(--color-text-muted);
}

.sales-table th:first-child,
.sales-table td:first-child {
  width: 33px;
}

.sales-table input[type='checkbox'] {
  width: 13px;
  height: 13px;
  margin: 0;
}

.sales-table tbody tr.sales-table__row--age-shift-warning .customer-name {
  text-decoration-color: rgb(251 146 60 / 42%);
}

.sales-table tbody tr.sales-table__row--age-shift-near .customer-name {
  text-decoration-color: rgb(250 204 21 / 48%);
}

.sales-table tbody tr.sales-table__row--age-shift-warning .customer-name,
.sales-table tbody tr.sales-table__row--age-shift-near .customer-name {
  text-decoration-line: underline;
  text-decoration-skip-ink: none;
  text-decoration-thickness: 0.62em;
  text-underline-offset: -0.3em;
}

.customer-name {
  position: relative;
  display: inline-block;
  color: inherit;
  font-weight: 700;
}

.customer-name:hover {
  color: var(--color-primary);
}

.customer-name--age-shift {
  outline: none;
}

.customer-name__tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 7px);
  z-index: 10;
  width: max-content;
  max-width: 160px;
  visibility: hidden;
  border-radius: 6px;
  background: #273043;
  color: #ffffff;
  opacity: 0;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.3;
  pointer-events: none;
  transform: translate(-50%, 3px);
  transition:
    opacity 120ms ease,
    transform 120ms ease,
    visibility 120ms ease;
}

.customer-name__tooltip::after {
  position: absolute;
  top: 100%;
  left: 50%;
  border: 4px solid transparent;
  border-top-color: #273043;
  content: '';
  transform: translateX(-50%);
}

.customer-name--age-shift:hover .customer-name__tooltip,
.customer-name--age-shift:focus .customer-name__tooltip {
  visibility: visible;
  opacity: 1;
  transform: translate(-50%, 0);
}

.step-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  box-shadow: inset 0 -1px 2px rgb(0 0 0 / 20%);
}

.step-dot--danger {
  background: #e22b2f;
}

.step-dot--warning {
  background: #ffd319;
}

.contract-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 22px;
  border-radius: var(--radius-pill);
  padding: 0 10px;
  font-size: 11px;
  font-weight: 800;
}

.contract-badge--danger-soft {
  background: #f5e8ea;
  color: #9f4b58;
}

.contract-badge--muted {
  background: #edf1f5;
  color: #657386;
}

.contract-badge--warning {
  background: #fff4d7;
  color: #8a6412;
}

.contract-badge--danger {
  background: #ffe4e6;
  color: #b23b49;
}

.contract-badge--success {
  background: #ddf7e7;
  color: #24723b;
}

.contract-badge--blue {
  background: #e3efff;
  color: #285fba;
}

.report-button {
  min-width: 54px;
  height: 26px;
  border: 0;
  border-radius: 6px;
  background: #4e63e6;
  color: #ffffff;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 800;
}

.report-button--disabled {
  background: #c5cad3;
  color: #ffffff;
}

.report-button--bulk {
  min-width: 50px;
  height: 26px;
  background: #4e63e6;
}

.report-button--bulk:hover:not(:disabled),
.report-button:hover:not(:disabled) {
  background: #4055d4;
}

.report-button--bulk:disabled {
  background: #c5cad3;
}

.report-status {
  font-weight: 400;
}
</style>
