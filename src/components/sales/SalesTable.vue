<script setup lang="ts">
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
  sendReport: [customer: SalesCustomer]
  bulkSend: []
}>()

const SENDABLE_REPORT_STATUS_CODES = new Set(['01', '02', '03'])

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
// 백엔드 성별 코드와 영문 값을 화면 표시값으로 변환한다.
const genderLabel = (gender: string) => {
  if (gender === 'MALE' || gender === 'M') return '남'
  if (gender === 'FEMALE' || gender === 'F') return '여'
  return gender
}

// 계약 상태 코드에 대응하는 배지 색상 클래스를 결정한다.
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

// 상령일 임박 고객을 우선순위 색상으로 표시한다.
const stepClass = (sortRank: number) => (sortRank === 1 ? 'danger' : 'warning')
</script>

<template>
  <div class="sales-table">
    <table>
      <thead>
        <tr>
          <th><input type="checkbox" /></th>
          <th>고객명</th>
          <th>성별</th>
          <th>만 나이</th>
          <th>생년월일</th>
          <th>3step</th>
          <th>고객 단계</th>
          <th>계약 현황</th>
          <th>보험명</th>
          <th>피보험자</th>
          <th>웹폼 회수일</th>
          <th>리포트 발송상태</th>
          <th>
            <button
              class="bulk-send-button"
              type="button"
              :disabled="props.isBulkSending"
              @click="emit('bulkSend')"
            >
              {{ props.isBulkSending ? '발송 중' : '일괄 발송' }}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.customerId">
          <td><input type="checkbox" /></td>
          <td>
            <RouterLink
              class="customer-name"
              :to="{
                name: 'user-detail',
                params: { customerId: customer.customerId },
                query: { conversionStatusCode: resolveSalesCustomerStageCode(customer) },
              }"
            >
              {{ customer.customerName }}
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
          <td>{{ customer.reportStatusName }}</td>
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
  overflow: hidden;
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

.customer-name {
  color: #273248;
  font-weight: 800;
}

.customer-name:hover {
  color: var(--color-primary);
  text-decoration: underline;
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
  min-width: 52px;
  height: 26px;
  border: 0;
  border-radius: var(--radius-pill);
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

.bulk-send-button {
  min-width: 64px;
  height: 24px;
  border: 0;
  border-radius: var(--radius-pill);
  background: #273248;
  color: #ffffff;
  padding: 0 10px;
  font-size: 10px;
  font-weight: 850;
}

.bulk-send-button:disabled {
  background: #aeb6c2;
}
</style>
