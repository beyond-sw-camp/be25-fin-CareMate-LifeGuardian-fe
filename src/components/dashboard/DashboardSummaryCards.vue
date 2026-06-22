<script setup lang="ts">
import type { DashboardSummary } from '@/api/dashboard'

const props = defineProps<{
  summary: DashboardSummary | null
}>()

const countLabel = (count?: number) => `${count ?? 0}명`
</script>

<template>
  <section class="dashboard-summary">
    <div class="dashboard-summary__top">
      <article class="summary-small-card">
        <span>잠재고객 미상담 고객</span>
        <strong>{{ countLabel(summary?.uncontactedCustomerCount) }}</strong>
      </article>

      <article class="summary-small-card">
        <span>잠재고객 상담 중 고객</span>
        <strong>{{ countLabel(summary?.consultingCustomerCount) }}</strong>
      </article>
    </div>

    <div class="dashboard-summary__grid">
      <article class="summary-status-card">
        <span>설계 중</span>
        <strong>{{ countLabel(summary?.designingContractCount) }}</strong>
      </article>

      <article class="summary-status-card">
        <span>설계 완료</span>
        <strong>{{ countLabel(summary?.designedContractCount) }}</strong>
      </article>

      <article class="summary-status-card">
        <span>청약 중</span>
        <strong>{{ countLabel(summary?.subscriptionInProgressCount) }}</strong>
      </article>

      <article class="summary-status-card">
        <span>청약 완료</span>
        <strong>{{ countLabel(summary?.subscriptionCompletedCount) }}</strong>
      </article>

      <article class="summary-status-card">
        <span>수납 완료</span>
        <strong>{{ countLabel(summary?.paymentCompletedCount) }}</strong>
      </article>

      <article class="summary-status-card">
        <span>계약 완료</span>
        <strong>{{ countLabel(summary?.contractCompletedCount) }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.dashboard-summary {
  display: grid;
  gap: 8px;
}

.dashboard-summary__top {
  display: grid;
  grid-template-columns: repeat(2, 280px);
  gap: 16px;
  justify-content: start;
}

.summary-small-card {
  height: 65px;
  border: 1px solid #e3e8f0;
  background: #ffffff;
  padding: 9px 18px;
}

.summary-small-card span {
  display: block;
  color: #7f8999;
  font-size: 12px;
  font-weight: 700;
}

.summary-small-card strong {
  display: block;
  margin-top: 2px;
  color: #172033;
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
}

.dashboard-summary__grid {
  display: grid;
  grid-template-columns: repeat(3, 280px);
  gap: 15px 16px;
  justify-content: start;

  margin-top: 15px;
}

.summary-status-card {
  display: flex;
  height: 96px;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e3e8f0;
  border-radius: 8px;
  background: #ffffff;
  padding: 18px 18px 16px;
}

.summary-status-card span {
  color: #515b88;
  font-size: 15px;
  font-weight: 800;
}

.summary-status-card strong {
  align-self: flex-end;
  color: #111827;
  font-size: 22px;
  font-weight: 900;
}

@media (max-width: 1100px) {
  .dashboard-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>