<script setup lang="ts">
import type { UserDetail } from '@/api/userDetail'
import {
  fallback,
  genderLabel,
  resolveAgeShiftDDay,
  resolveLifeStageLabel,
} from '@/utils/userDetail'

defineProps<{
  user: UserDetail
  isPotentialCustomer: boolean
}>()
</script>

<template>
  <section class="profile-section card">
    <div class="profile-main">
      <div class="profile-avatar" aria-hidden="true">{{ user.childName?.slice(0, 1) || '?' }}</div>
      <div class="profile-summary">
        <div class="profile-title">
          <h1>{{ fallback(user.childName) }}</h1>
          <span v-for="badge in user.badges || []" :key="badge.code" class="profile-badge">
            {{ badge.name }}
          </span>
        </div>
        <p>
          {{ genderLabel(user.childGender) }} · {{ fallback(user.childAge) }}세 ·
          {{ fallback(user.childBirthDate) }}
        </p>
        <div class="profile-status">
          <span v-if="isPotentialCustomer">{{ fallback(user.consultStatusName) }}</span>
          <span>{{ fallback(user.conversionStatusName) }}</span>
        </div>
      </div>
    </div>

    <aside class="lifecycle-panel">
      <span class="panel-label">생애주기 정보</span>
      <strong>{{ resolveLifeStageLabel(user) }}</strong>
      <p>보험나이 변경 기준일 {{ fallback(user.insuranceAgeShiftDate) }}</p>
      <b>{{ resolveAgeShiftDDay(user) || '-' }}</b>
    </aside>
  </section>
</template>

<style scoped>
.profile-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 20px;
  padding: 20px;
}

.profile-main {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 16px;
}

.profile-avatar {
  display: grid;
  width: 72px;
  height: 72px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 16px;
  background: #eaf2ff;
  color: var(--color-primary);
  font-size: 28px;
  font-weight: 950;
}

.profile-summary {
  display: grid;
  min-width: 0;
  gap: 7px;
}

.profile-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}

.profile-title h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 950;
  letter-spacing: 0;
}

.profile-summary p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 13px;
}

.profile-badge,
.profile-status span {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 800;
}

.profile-badge {
  border: 1px solid #d8e5ff;
  background: #f3f7ff;
  color: #245fc5;
}

.profile-status {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.profile-status span {
  background: #eef1f6;
  color: #536174;
}

.lifecycle-panel {
  display: grid;
  align-content: start;
  gap: 5px;
  border: 1px solid #d8e5ff;
  border-radius: 8px;
  background: #f8fbff;
  padding: 16px;
}

.panel-label {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
}

.lifecycle-panel strong {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 950;
}

.lifecycle-panel p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.lifecycle-panel b {
  margin-top: 4px;
  color: #ef4444;
  font-size: 20px;
}

@media (max-width: 980px) {
  .profile-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-main {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
