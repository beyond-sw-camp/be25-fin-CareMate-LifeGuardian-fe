<script setup lang="ts">
import { computed, reactive } from 'vue'

import type { SalesSearchFilters } from '@/api/sales'

const emit = defineEmits<{
  search: [filters: SalesSearchFilters]
}>()

const initialForm = () => ({
  customerName: '',
  age: '',
  gender: '' as '' | 'Male' | 'Female',
  consultStatusCodes: [] as string[],
  contractStatusCodes: [] as string[],
  hasReport: false,
  hasThreeStep: false,
})

const form = reactive(initialForm())
const consultStatusLabels: Record<string, string> = {
  '01': '미상담',
  '02': '상담중',
}
const contractStatusLabels: Record<string, string> = {
  '01': '설계중',
  '02': '설계완료',
  '03': '청약중',
  '04': '청약완료',
  '06': '수납완료',
}
const quickFilters = [
  { label: '미상담 잠재', filters: { consultStatusCodes: ['01'] } },
  { label: '상담중 잠재', filters: { consultStatusCodes: ['02'] } },
  { label: '청약 진행', filters: { contractStatusCodes: ['03', '04'] } },
  { label: '수납완료', filters: { contractStatusCodes: ['06'] } },
  { label: '3-Step', filters: { hasThreeStep: true } },
] as const
const appliedFilterChips = computed(() => {
  const chips: { key: string; label: string; remove: () => void }[] = []

  if (form.customerName.trim()) {
    chips.push({
      key: 'customerName',
      label: `고객 ${form.customerName.trim()}`,
      remove: () => {
        form.customerName = ''
      },
    })
  }

  if (form.age !== '') {
    chips.push({
      key: 'age',
      label: `나이 ${form.age}`,
      remove: () => {
        form.age = ''
      },
    })
  }

  if (form.gender) {
    chips.push({
      key: 'gender',
      label: form.gender === 'Male' ? '남' : '여',
      remove: () => {
        form.gender = ''
      },
    })
  }

  form.consultStatusCodes.forEach((code) => {
    chips.push({
      key: `consult-${code}`,
      label: `상담 ${consultStatusLabels[code] ?? code}`,
      remove: () => {
        form.consultStatusCodes = form.consultStatusCodes.filter((item) => item !== code)
      },
    })
  })

  form.contractStatusCodes.forEach((code) => {
    chips.push({
      key: `contract-${code}`,
      label: `계약 ${contractStatusLabels[code] ?? code}`,
      remove: () => {
        form.contractStatusCodes = form.contractStatusCodes.filter((item) => item !== code)
      },
    })
  })

  if (form.hasReport) {
    chips.push({
      key: 'hasReport',
      label: '리포트',
      remove: () => {
        form.hasReport = false
      },
    })
  }

  if (form.hasThreeStep) {
    chips.push({
      key: 'hasThreeStep',
      label: '3-Step',
      remove: () => {
        form.hasThreeStep = false
      },
    })
  }

  return chips
})

// 빈 입력값은 쿼리 파라미터에서 제외해 백엔드 기본 조건을 사용한다.
const submit = () => {
  emit('search', {
    customerName: form.customerName.trim() || undefined,
    age: form.age === '' ? undefined : Number(form.age),
    gender: form.gender || undefined,
    consultStatusCodes: form.consultStatusCodes.length ? [...form.consultStatusCodes] : undefined,
    contractStatusCodes: form.contractStatusCodes.length ? [...form.contractStatusCodes] : undefined,
    hasReport: form.hasReport || undefined,
    hasThreeStep: form.hasThreeStep || undefined,
  })
}

// 폼과 부모 컴포넌트의 검색 조건을 함께 초기화한다.
const reset = () => {
  Object.assign(form, initialForm())
  submit()
}

const applyQuickFilter = (filters: Partial<ReturnType<typeof initialForm>>) => {
  Object.assign(form, initialForm(), filters)
  submit()
}

const removeFilter = (remove: () => void) => {
  remove()
  submit()
}
</script>

<template>
  <form class="card sales-search" @submit.prevent="submit">
    <div class="sales-search__header">
      <h3 class="sales-section-title">검색조건</h3>
      <div class="sales-search__quick" aria-label="빠른 필터">
        <button
          v-for="quickFilter in quickFilters"
          :key="quickFilter.label"
          class="sales-search__quick-button"
          type="button"
          @click="applyQuickFilter(quickFilter.filters)"
        >
          {{ quickFilter.label }}
        </button>
      </div>
    </div>

    <div class="sales-search__row sales-search__row--top">
      <label class="sales-search__field">
        <span>고객 이름</span>
        <input v-model="form.customerName" class="sales-search__input" placeholder="이름을 입력하세요." />
      </label>

      <label class="sales-search__field sales-search__field--age">
        <span>나이</span>
        <input v-model="form.age" class="sales-search__input" min="0" type="number" placeholder="나이를 입력하세요." />
      </label>

      <fieldset class="sales-search__gender">
        <legend>성별</legend>
        <label><input v-model="form.gender" type="radio" value="Male" @change="submit" /> 남</label>
        <label><input v-model="form.gender" type="radio" value="Female" @change="submit" /> 여</label>
      </fieldset>
    </div>

    <div class="sales-search__row sales-search__row--filters">
      <span class="sales-search__label">상담 현황</span>
      <div class="sales-search__options">
        <label class="sales-search__toggle">
          <input v-model="form.consultStatusCodes" type="checkbox" value="01" @change="submit" />
          <span>미상담</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.consultStatusCodes" type="checkbox" value="02" @change="submit" />
          <span>상담중</span>
        </label>
      </div>

      <span class="sales-search__label sales-search__label--contract">계약 현황</span>
      <div class="sales-search__options">
        <label class="sales-search__toggle">
          <input v-model="form.contractStatusCodes" type="checkbox" value="01" @change="submit" />
          <span>설계중</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.contractStatusCodes" type="checkbox" value="02" @change="submit" />
          <span>설계완료</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.contractStatusCodes" type="checkbox" value="03" @change="submit" />
          <span>청약중</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.contractStatusCodes" type="checkbox" value="04" @change="submit" />
          <span>청약완료</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.contractStatusCodes" type="checkbox" value="06" @change="submit" />
          <span>수납완료</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.hasReport" type="checkbox" @change="submit" />
          <span>리포트</span>
        </label>
        <label class="sales-search__toggle">
          <input v-model="form.hasThreeStep" type="checkbox" @change="submit" />
          <span>3-Step</span>
        </label>
      </div>

      <div class="sales-search__actions">
        <button class="button button-primary sales-search__button" type="submit">조회</button>
        <button class="button button-primary sales-search__button" type="button" @click="reset">초기화</button>
      </div>
    </div>

    <div v-if="appliedFilterChips.length" class="sales-search__applied" aria-label="적용된 필터">
      <span class="sales-search__applied-label">적용 필터</span>
      <button
        v-for="chip in appliedFilterChips"
        :key="chip.key"
        class="sales-search__chip"
        type="button"
        @click="removeFilter(chip.remove)"
      >
        {{ chip.label }}
        <span aria-hidden="true">x</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.sales-search {
  margin-bottom: 12px;
  border: 1px solid #e3e8f0;
  box-shadow: none;
  padding: 10px 14px 12px;
}

.sales-search__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 9px;
}

.sales-section-title {
  margin: 0;
  color: #263142;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0;
}

.sales-search__quick {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 5px;
}

.sales-search__quick-button {
  height: 24px;
  border: 1px solid #dfe5ee;
  border-radius: 5px;
  background: #f7f9fc;
  color: #4f5d70;
  padding: 0 9px;
  font-size: 10px;
  font-weight: 800;
}

.sales-search__quick-button:hover {
  border-color: #cbd7ee;
  background: #eef3ff;
  color: #4055d4;
}

.sales-search__row {
  display: grid;
  align-items: center;
  min-height: 28px;
  color: #394252;
  font-size: 11px;
  font-weight: 700;
}

.sales-search__row--top {
  grid-template-columns: minmax(210px, 260px) minmax(150px, 180px) minmax(130px, 160px);
  column-gap: 16px;
  margin-bottom: 8px;
}

.sales-search__field {
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
}

.sales-search__field--age {
  margin-left: 0;
}

.sales-search__input {
  width: 100%;
  height: 26px;
  border: 1px solid #d9e0ea;
  border-radius: 5px;
  background: #ffffff;
  padding: 0 8px;
  color: var(--color-text);
  font-size: 11px;
  outline: none;
}

.sales-search__input:focus {
  border-color: #8db5ff;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(26 109 255 / 10%);
}

.sales-search__input::placeholder {
  color: #a6afbd;
}

.sales-search__gender {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.sales-search__gender legend {
  float: left;
  margin-right: 8px;
  font-weight: 700;
  white-space: nowrap;
}

.sales-search__label {
  white-space: nowrap;
}

.sales-search__label--contract {
  margin-left: 26px;
}

.sales-search__row--filters {
  grid-template-columns: max-content auto max-content minmax(0, 1fr) auto;
  column-gap: 12px;
  border-top: 1px solid #edf1f6;
  padding-top: 9px;
}

.sales-search__applied {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
  border-top: 1px solid #edf1f6;
  padding-top: 8px;
}

.sales-search__applied-label {
  margin-right: 3px;
  color: #7c8797;
  font-size: 10px;
  font-weight: 800;
}

.sales-search__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  border: 1px solid #d6e0f7;
  border-radius: 999px;
  background: #f3f6ff;
  color: #4055d4;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 800;
}

.sales-search__chip span {
  color: #7d8bb2;
  font-size: 11px;
  line-height: 1;
}

.sales-search label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.sales-search__options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px 6px;
  min-width: 0;
}

.sales-search input[type='radio'] {
  width: 12px;
  height: 12px;
  margin: 0;
  accent-color: var(--color-primary);
}

.sales-search__toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.sales-search__toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.sales-search__toggle span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  border: 1px solid #dbe3ef;
  border-radius: 999px;
  background: #ffffff;
  color: #5d6878;
  padding: 0 10px;
  font-size: 10px;
  font-weight: 850;
  line-height: 1;
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease;
}

.sales-search__toggle span::before {
  width: 0;
  overflow: hidden;
  color: inherit;
  content: '✓';
  font-size: 10px;
  font-weight: 900;
  transition:
    width 120ms ease,
    margin-right 120ms ease;
}

.sales-search__toggle input:checked + span {
  border-color: #b8c7ff;
  background: #eef3ff;
  color: #4055d4;
  box-shadow: inset 0 0 0 1px rgb(78 99 230 / 10%);
}

.sales-search__toggle input:checked + span::before {
  width: 10px;
  margin-right: 3px;
}

.sales-search__toggle input:focus-visible + span {
  outline: 2px solid rgb(78 99 230 / 25%);
  outline-offset: 2px;
}

.sales-search__actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.sales-search__button {
  min-width: 52px;
  min-height: 26px;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 11px;
}

@media (max-width: 1100px) {
  .sales-search__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .sales-search__quick {
    justify-content: flex-start;
  }

  .sales-search__row--top,
  .sales-search__row--filters {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .sales-search__actions {
    margin-left: 0;
  }
}
</style>
