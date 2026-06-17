<template>
  <section class="recommendation-card">
    <header>
      <div class="recommendation-title">
        <span class="recommendation-icon" aria-hidden="true">AI</span>
        <div>
          <h2>추천 분석</h2>
          <p>상담 가이드</p>
        </div>
      </div>
    </header>

    <div class="recommendation-panel">
      <span>1순위 추천 상품</span>
      <strong>추천 상품 정보가 연결되면 표시됩니다.</strong>
    </div>
    <div class="recommendation-panel">
      <span>추천 이유</span>
      <strong>고객 정보 기반 추천 사유가 연결되면 표시됩니다.</strong>
    </div>
  </section>
</template>

<style scoped>
.recommendation-card {
  display: grid;
  gap: 12px;
  overflow: hidden;
  border-radius: 8px;
  background: linear-gradient(135deg, #6548ff 0%, #8b22ff 100%);
  color: #ffffff;
  padding: 18px 22px 20px;
  box-shadow: 0 10px 22px rgb(102 72 255 / 20%);
}

.recommendation-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.recommendation-icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: rgb(255 255 255 / 18%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
}

.recommendation-card h2,
.recommendation-card p {
  margin: 0;
}

.recommendation-card h2 {
  font-size: 16px;
  font-weight: 900;
}

.recommendation-card p,
.recommendation-panel span {
  color: rgb(255 255 255 / 72%);
  font-size: 11px;
  font-weight: 700;
}

.recommendation-panel {
  display: grid;
  gap: 5px;
  border-radius: 7px;
  background: rgb(255 255 255 / 11%);
  padding: 12px 14px;
}

.recommendation-panel strong {
  color: #ffffff;
  font-size: 13px;
  font-weight: 850;
}
</style>
