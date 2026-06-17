<script setup lang="ts">
import { reactive } from 'vue'

import type { SalesSearchFilters } from '@/api/sales'

const emit = defineEmits<{
  search: [filters: SalesSearchFilters]
}>()

const initialForm = () => ({
  customerName: '',
  age: '',
  gender: '' as '' | 'Male' | 'Female',
  contractStatusCodes: [] as string[],
  hasReport: false,
  hasThreeStep: false,
})

const form = reactive(initialForm())

// 빈 입력값은 쿼리 파라미터에서 제외해 백엔드 기본 조건을 사용한다.
const submit = () => {
  emit('search', {
    customerName: form.customerName.trim() || undefined,
    age: form.age === '' ? undefined : Number(form.age),
    gender: form.gender || undefined,
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
</script>

<template>
  <form class="card sales-search" @submit.prevent="submit">
    <h3 class="sales-section-title">검색조건</h3>

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
        <label><input v-model="form.gender" type="radio" value="Male" /> 남</label>
        <label><input v-model="form.gender" type="radio" value="Female" /> 여</label>
      </fieldset>
    </div>

    <div class="sales-search__row sales-search__row--filters">
      <span class="sales-search__label">계약 현황</span>
      <div class="sales-search__options">
        <label><input v-model="form.contractStatusCodes" type="checkbox" value="01" /> 설계중</label>
        <label><input v-model="form.contractStatusCodes" type="checkbox" value="02" /> 설계완료</label>
        <label><input v-model="form.contractStatusCodes" type="checkbox" value="03" /> 청약중</label>
        <label><input v-model="form.contractStatusCodes" type="checkbox" value="04" /> 청약완료</label>
        <label><input v-model="form.contractStatusCodes" type="checkbox" value="05" /> 수납완료</label>
        <label><input v-model="form.hasReport" type="checkbox" /> 리포트</label>
        <label><input v-model="form.hasThreeStep" type="checkbox" /> 3-Step</label>
      </div>

      <div class="sales-search__actions">
        <button class="button button-primary sales-search__button" type="submit">조회</button>
        <button class="button button-primary sales-search__button" type="button" @click="reset">초기화</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.sales-search {
  margin-bottom: 17px;
  padding: 14px 17px 16px;
}

.sales-section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0;
}

.sales-search__row {
  display: grid;
  align-items: center;
  min-height: 32px;
  color: #394252;
  font-size: 12px;
  font-weight: 700;
}

.sales-search__row--top {
  grid-template-columns: minmax(250px, 300px) minmax(200px, 240px) minmax(150px, 180px);
  column-gap: 22px;
  margin-bottom: 12px;
}

.sales-search__field {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}

.sales-search__field--age {
  margin-left: 0;
}

.sales-search__input {
  width: 100%;
  height: 30px;
  border: 1px solid #d9e0ea;
  border-radius: 6px;
  background: #f8fafc;
  padding: 0 10px;
  color: var(--color-text);
  font-size: 12px;
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
  gap: 10px;
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

.sales-search__row--filters {
  grid-template-columns: 58px minmax(0, 1fr) auto;
  column-gap: 12px;
  border-top: 1px solid #edf1f6;
  padding-top: 12px;
}

.sales-search label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.sales-search__options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px 10px;
  min-width: 0;
}

.sales-search input[type='checkbox'],
.sales-search input[type='radio'] {
  width: 12px;
  height: 12px;
  margin: 0;
  accent-color: var(--color-primary);
}

.sales-search__actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.sales-search__button {
  min-width: 58px;
  min-height: 30px;
  border-radius: 6px;
  padding: 0 11px;
  font-size: 11px;
}

@media (max-width: 1100px) {
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
