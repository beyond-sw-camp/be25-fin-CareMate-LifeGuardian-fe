<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '../../components/common/Header.vue'
import AppSidebar from '../../components/common/Sidebar.vue'
import SalesPagination from '../../components/sales/SalesPagination.vue'
import SalesSearchForm from '../../components/sales/SalesSearchForm.vue'
import SalesSummary from '../../components/sales/SalesSummary.vue'
import SalesTable from '../../components/sales/SalesTable.vue'

const isCriteriaModalOpen = ref(false)

const customers = [
  {
    name: '박재현',
    gender: '남',
    age: 16,
    birthDate: '0000/05/15',
    step: 'danger',
    customerStage: '잠재 고객',
    contractStatus: '미상담',
    contractClass: 'danger-soft',
    productName: '-',
    insuredName: '박재현',
    dueDate: '-',
    reportStatus: '미발송',
  },
  {
    name: '오수진',
    gender: '여',
    age: 10,
    birthDate: '0000/05/15',
    step: 'warning',
    customerStage: '잠재 고객',
    contractStatus: '상담중',
    contractClass: 'muted',
    productName: '-',
    insuredName: '오수진',
    dueDate: '0000/00/00',
    reportStatus: '발송완료',
  },
  {
    name: '이찬호',
    gender: '남',
    age: 49,
    birthDate: '0000/05/15',
    step: 'danger',
    customerStage: '통합 고객',
    contractStatus: '설계중',
    contractClass: 'warning',
    productName: '종합보험',
    insuredName: '김상호',
    dueDate: '0000/00/00',
    reportStatus: '발송완료',
  },
  {
    name: '김수빈',
    gender: '여',
    age: 13,
    birthDate: '0000/05/15',
    step: 'danger',
    customerStage: '잠재 고객',
    contractStatus: '상담중',
    contractClass: 'muted',
    productName: '-',
    insuredName: '김수빈',
    dueDate: '0000/00/00',
    reportStatus: '발송완료',
  },
  {
    name: '박하늘',
    gender: '여',
    age: 9,
    birthDate: '0000/05/15',
    step: 'danger',
    customerStage: '통합 고객',
    contractStatus: '청약완료',
    contractClass: 'danger',
    productName: '치아보험',
    insuredName: '박하늘',
    dueDate: '0000/00/00',
    reportStatus: '미발송',
  },
  {
    name: '김마루',
    gender: '남',
    age: 17,
    birthDate: '0000/05/15',
    step: 'warning',
    customerStage: '통합 고객',
    contractStatus: '청약중',
    contractClass: 'success',
    productName: '치아보험',
    insuredName: '김마루',
    dueDate: '0000/00/00',
    reportStatus: '미발송',
  },
  {
    name: '이현구',
    gender: '남',
    age: 42,
    birthDate: '0000/05/15',
    step: 'warning',
    customerStage: '통합 고객',
    contractStatus: '설계완료',
    contractClass: 'blue',
    productName: '종합보험',
    insuredName: '김민국',
    dueDate: '0000/00/00',
    reportStatus: '발송완료',
  },
  {
    name: '백재구',
    gender: '남',
    age: 39,
    birthDate: '0000/05/15',
    step: 'danger',
    customerStage: '잠재 고객',
    contractStatus: '미상담',
    contractClass: 'danger-soft',
    productName: '-',
    insuredName: '-',
    dueDate: '-',
    reportStatus: '미발송',
  },
]
</script>

<template>
  <div class="app-shell sales-page">
    <AppSidebar active-label="영업현황" />

    <main class="app-main sales-page__main">
      <AppHeader title="영업현황" />

      <SalesSummary />
      <SalesSearchForm />

      <section class="card sales-list">
        <div class="sales-list__header">
          <h3 class="sales-section-title">목록</h3>
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

        <SalesTable :customers="customers" />
        <SalesPagination />
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
