<script setup lang="ts">
import type { SalesCustomer } from '@/api/sales'

defineProps<{
  customers: SalesCustomer[]
}>()

// 백엔드 성별 코드와 영문 값을 화면 표시값으로 변환한다.
const genderLabel = (gender: string) => {
  if (gender === 'Male' || gender === 'M') return '남'
  if (gender === 'Female' || gender === 'F') return '여'
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
          <th>납입 회수일</th>
          <th>리포트</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.customerId">
          <td><input type="checkbox" /></td>
          <td>{{ customer.customerName }}</td>
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
          <td>{{ customer.customerStageName }}</td>
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
            <button v-if="customer.canSendReport" class="report-button" type="button">발송</button>
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
  height: 30px;
  border-bottom: 1px solid #e7ebf1;
  padding: 0 8px;
  text-align: center;
  font-size: 10px;
  white-space: nowrap;
}

.sales-table th {
  height: 29px;
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
  width: 11px;
  height: 11px;
  margin: 0;
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
  min-width: 34px;
  height: 16px;
  border-radius: var(--radius-pill);
  padding: 0 6px;
  font-size: 9px;
  font-weight: 800;
}

.contract-badge--danger-soft {
  background: #ffd9df;
  color: #d85a65;
}

.contract-badge--muted {
  background: #dbe0e7;
  color: #767f8e;
}

.contract-badge--warning {
  background: #f9e64a;
  color: #788000;
}

.contract-badge--danger {
  background: #ff6969;
  color: #ffffff;
}

.contract-badge--success {
  background: #63df5b;
  color: #ffffff;
}

.contract-badge--blue {
  background: #9fc9ff;
  color: #2765b3;
}

.report-button {
  min-width: 27px;
  height: 16px;
  border: 0;
  border-radius: var(--radius-pill);
  background: #4e63e6;
  color: #ffffff;
  padding: 0 7px;
  font-size: 9px;
  font-weight: 800;
}
</style>
