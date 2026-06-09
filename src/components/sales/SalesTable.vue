<script setup lang="ts">
type Customer = {
  name: string
  gender: string
  age: number
  birthDate: string
  step: string
  customerStage: string
  contractStatus: string
  contractClass: string
  productName: string
  insuredName: string
  dueDate: string
  reportStatus: string
}

defineProps<{
  customers: Customer[]
}>()
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
        <tr v-for="customer in customers" :key="customer.name">
          <td><input type="checkbox" /></td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.gender }}</td>
          <td>{{ customer.age }}</td>
          <td>{{ customer.birthDate }}</td>
          <td>
            <span class="step-dot" :class="`step-dot--${customer.step}`"></span>
          </td>
          <td>{{ customer.customerStage }}</td>
          <td>
            <span class="contract-badge" :class="`contract-badge--${customer.contractClass}`">
              {{ customer.contractStatus }}
            </span>
          </td>
          <td>{{ customer.productName }}</td>
          <td>{{ customer.insuredName }}</td>
          <td>{{ customer.dueDate }}</td>
          <td>{{ customer.reportStatus }}</td>
          <td>
            <button class="report-button" type="button">발송</button>
          </td>
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
