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

    <div class="sales-search__row">
      <span class="sales-search__label">계약 현황</span>
      <label><input v-model="form.contractStatusCodes" type="checkbox" value="01" /> 설계중</label>
      <label><input v-model="form.contractStatusCodes" type="checkbox" value="02" /> 설계완료</label>
      <label><input v-model="form.contractStatusCodes" type="checkbox" value="03" /> 청약중</label>
      <label><input v-model="form.contractStatusCodes" type="checkbox" value="04" /> 청약완료</label>
      <label><input v-model="form.contractStatusCodes" type="checkbox" value="05" /> 수납완료</label>
      <label><input v-model="form.hasReport" type="checkbox" /> 리포트</label>
      <label><input v-model="form.hasThreeStep" type="checkbox" /> 3-Step 발송</label>

      <div class="sales-search__actions">
        <button class="button button-primary sales-search__button" type="submit">조회</button>
        <button class="button button-primary sales-search__button" type="button" @click="reset">초기화</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.sales-search {
  min-height: 134px;
  margin-bottom: 17px;
  padding: 14px 17px;
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
  padding-left: 20px;
  font-size: 12px;
  font-weight: 600;
}

.sales-search__row--top {
  grid-template-columns: minmax(260px, 1fr) minmax(210px, 0.8fr) 170px;
  column-gap: 42px;
  margin-bottom: 14px;
}

.sales-search__field {
  display: grid;
  grid-template-columns: 66px minmax(0, 200px);
  align-items: center;
  gap: 14px;
}

.sales-search__field--age {
  margin-left: 0;
}

.sales-search__input {
  width: 200px;
  height: 21px;
  border: 1px solid #d7dbe2;
  background: #f7f7f8;
  padding: 0 12px;
  color: var(--color-text);
  font-size: 11px;
  outline: none;
}

.sales-search__input::placeholder {
  color: #c3c7cf;
}

.sales-search__gender {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 0;
  margin: 0;
  padding: 0;
}

.sales-search__gender legend {
  float: left;
  margin-right: 16px;
  font-weight: 700;
}

.sales-search__label {
  margin-right: 2px;
}

.sales-search__row:not(.sales-search__row--top) {
  grid-template-columns: 86px repeat(7, max-content) 1fr auto;
  column-gap: 34px;
}

.sales-search label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sales-search input[type='checkbox'],
.sales-search input[type='radio'] {
  width: 11px;
  height: 11px;
  margin: 0;
}

.sales-search__actions {
  display: flex;
  gap: 14px;
  margin-left: auto;
  grid-column: 10;
  padding-right: 8px;
}

.sales-search__button {
  width: 56px;
  min-height: 28px;
  border-radius: 6px;
  padding: 0;
  font-size: 11px;
}
</style>
