<template>
  <nav class="sales-pagination" aria-label="페이지 이동">
    <button type="button">&lt;&lt;</button>
    <button type="button">&lt;</button>
    <button type="button">1</button>
    <button class="is-active" type="button">2</button>
    <button type="button">3</button>
    <button type="button">4</button>
    <button type="button">5</button>
    <button type="button">&gt;</button>
    <button type="button">&gt;&gt;</button>
  </nav>
</template>

<style scoped>
.sales-pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 9px;
}

.sales-pagination button {
  min-width: 12px;
  height: 21px;
  border: 0;
  background: transparent;
  color: #111111;
  padding: 0;
  font-size: 10px;
}

.sales-pagination button.is-active {
  min-width: 20px;
  border: 1px solid #b8c7db;
  background: #edf4ff;
  color: #6080aa;
}
</style>
