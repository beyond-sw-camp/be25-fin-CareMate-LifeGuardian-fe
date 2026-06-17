<template>
  <section class="script-card card">
    <header>
      <h2>상담 스크립트</h2>
      <button type="button" disabled>스크립트 복사</button>
    </header>
    <div class="script-content">
      <h3>상담 도입 안내</h3>
      <div class="script-box">
        <p>안녕하세요. 고객님의 보장 분석을 안내드립니다.</p>
        <p>현재 고객님의 생활주기와 계약 정보를 기준으로 상담에 필요한 항목을 확인했습니다.</p>
        <p>추천 상품과 상세 상담 문구는 보험 추천 및 스크립트 API가 연결되면 이 영역에 표시됩니다.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.script-card {
  padding: 18px;
}

.script-card > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #edf0f5;
  padding-bottom: 12px;
}

.script-card h2,
.script-card h3 {
  margin: 0;
  color: var(--color-text);
  font-weight: 900;
  letter-spacing: 0;
}

.script-card h2 {
  font-size: 16px;
}

.script-card h3 {
  color: #313746;
  font-size: 13px;
}

.script-card button {
  min-height: 30px;
  border: 0;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 800;
}

.script-content {
  display: grid;
  gap: 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  margin-top: 14px;
  padding: 14px;
}

.script-box {
  display: grid;
  gap: 10px;
  min-height: 130px;
  border: 1px solid #e3e7ee;
  background: #f8f9fb;
  padding: 16px;
  color: #3c4352;
  font-size: 12px;
  line-height: 1.65;
}

.script-box p {
  margin: 0;
}
</style>
