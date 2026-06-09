<script setup lang="ts">
import type { SalesSummary } from '@/api/sales'

defineProps<{
  summary: SalesSummary | null
}>()
</script>

<template>
  <section class="sales-summary" aria-label="영업 실적 요약">
    <article class="card sales-summary__count-card">
      <p class="sales-summary__label">월 계약 수</p>
      <strong class="sales-summary__count">{{ summary?.contractCount ?? 0 }}<span>건</span></strong>
    </article>

    <article class="card sales-summary__target-card">
      <p class="sales-summary__label">{{ summary?.month ?? '-' }}월 실적 목표 {{ summary?.targetCount ?? 0 }}건</p>
      <div class="sales-summary__progress-track">
        <div
          class="sales-summary__progress-fill"
          :style="{ width: `${Math.min(summary?.achievementRate ?? 0, 100)}%` }"
        ></div>
      </div>
      <p class="sales-summary__caption">목표 달성률 {{ summary?.achievementRate ?? 0 }}%</p>
    </article>
  </section>
</template>

<style scoped>
.sales-summary {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

.sales-summary__count-card,
.sales-summary__target-card {
  min-height: 75px;
  padding: 9px 14px;
}

.sales-summary__label,
.sales-summary__caption {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
}

.sales-summary__count {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  color: #222222;
  font-size: 39px;
  font-weight: 400;
  line-height: 1.08;
}

.sales-summary__count span {
  font-size: 16px;
}

.sales-summary__progress-track {
  height: 14px;
  margin: 12px 25px 8px 0;
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: #e9eef5;
}

.sales-summary__progress-fill {
  width: 78%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #3558ff, #3c73ff);
}
</style>
