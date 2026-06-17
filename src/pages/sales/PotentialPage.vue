<script setup lang="ts">
import AppHeader from '../../components/common/Header.vue'
import AppSidebar from '../../components/common/Sidebar.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar active-label="잠재고객 관리" />

    <main class="app-main page-placeholder">
      <AppHeader title="잠재고객 관리" />
    </main>
  </div>
</template>

<style scoped>
.page-placeholder {
  padding: 24px 28px;
}
</style>