<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import {
  ACCESS_TOKEN_STORAGE_KEY,
  ADMIN_ROLE,
  SALES_ROLE,
  USER_BRANCH_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
  USER_REGION_STORAGE_KEY,
  USER_ROLE_STORAGE_KEY,
  type UserRole,
} from '../../constants/auth'

type SidebarItem = {
  label: string
  to: string
}

const role = localStorage.getItem(USER_ROLE_STORAGE_KEY) as UserRole | null
const isLoggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY))
const isAdmin = isLoggedIn && role === ADMIN_ROLE
const sidebarWidth = ref(208)
const isResizing = ref(false)

const MIN_SIDEBAR_WIDTH = 180
const MAX_SIDEBAR_WIDTH = 280
let previousUserSelect = ''

const clampSidebarWidth = (width: number) =>
  Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width))

const stopResize = () => {
  window.removeEventListener('pointermove', resizeSidebar)
  window.removeEventListener('pointerup', stopResize)
  document.body.style.userSelect = previousUserSelect
  isResizing.value = false
}

const resizeSidebar = (event: PointerEvent) => {
  sidebarWidth.value = clampSidebarWidth(event.clientX)
}

const startResize = (event: PointerEvent) => {
  event.preventDefault()
  isResizing.value = true
  previousUserSelect = document.body.style.userSelect
  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', resizeSidebar)
  window.addEventListener('pointerup', stopResize)
}

onBeforeUnmount(() => {
  stopResize()
})

const displayName = localStorage.getItem(USER_NAME_STORAGE_KEY) ?? (isAdmin ? '홍길동' : '김설계')
const branch = localStorage.getItem(USER_BRANCH_STORAGE_KEY) ?? '강남지점'
const region = localStorage.getItem(USER_REGION_STORAGE_KEY)
const branchName = region ? `${region} ${branch}` : branch

const salesItems: SidebarItem[] = [
  { label: '대시보드', to: '/sales/dashboard' },
  { label: '영업현황', to: '/sales' },
  { label: '잠재고객 관리', to: '/potential' },
]

const adminItems: SidebarItem[] = [
  { label: '대시보드', to: '/admin/dashboard' },
  { label: '영업사원 관리', to: '/admin/members' },
  { label: '시스템 감사', to: '/admin/audit' },
  { label: 'ESG', to: '/admin/esg' },
]

const defaultItems = isAdmin ? adminItems : salesItems
const logoTo = role === SALES_ROLE ? '/sales/dashboard' : '/admin/dashboard'
const profileParts = isAdmin
  ? {
      primary: branchName,
      secondary: `${displayName} 지점장`,
      meta: '관리자 계정',
    }
  : {
      primary: displayName,
      secondary: branchName,
      meta: '전속 설계사',
    }
const profileInitial = displayName.slice(0, 1)

const props = withDefaults(
  defineProps<{
    activeLabel?: string
    items?: SidebarItem[]
  }>(),
  {
    activeLabel: '대시보드',
  },
)

const navigationItems = props.items ?? defaultItems
</script>

<template>
  <aside
    class="app-sidebar sidebar"
    :class="{ 'sidebar--admin': isAdmin, 'is-resizing': isResizing }"
    :style="{ width: `${sidebarWidth}px`, flexBasis: `${sidebarWidth}px` }"
  >
    <div class="sidebar__brand">
      <RouterLink class="sidebar__logo" :to="logoTo">
        <span class="sidebar__logo-text">
          <strong><span>Life</span>Guardian</strong>
          <small>{{ isAdmin ? 'ADMIN WORKSPACE' : 'SALES WORKSPACE' }}</small>
        </span>
      </RouterLink>
    </div>

    <nav class="sidebar__nav" aria-label="주요 메뉴">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.label"
        class="sidebar__nav-item"
        :class="{ 'is-active': item.label === props.activeLabel }"
        :to="item.to"
      >
        <span class="sidebar__nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <section class="sidebar__profile" aria-label="사용자 정보">
      <span class="sidebar__profile-avatar" aria-hidden="true">{{ profileInitial }}</span>
      <span class="sidebar__profile-copy">
        <span class="sidebar__profile-label">{{ profileParts.meta }}</span>
        <strong>{{ profileParts.primary }}</strong>
        <span>{{ profileParts.secondary }}</span>
      </span>
    </section>

    <div
      class="sidebar__resize-handle"
      role="separator"
      aria-label="사이드바 너비 조절"
      aria-orientation="vertical"
      @pointerdown="startResize"
    ></div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: relative;
  display: flex;
  width: 208px;
  min-height: 100vh;
  flex: 0 0 208px;
  flex-direction: column;
  border-right: 1px solid #edf0f7;
  background:
    radial-gradient(circle at 0% 16%, rgb(232 238 255 / 44%) 0, transparent 35%),
    radial-gradient(circle at 100% 92%, rgb(247 232 240 / 30%) 0, transparent 36%),
    linear-gradient(180deg, #fbfcff 0%, #f9fbff 55%, #fffbfd 100%);
  padding: 28px 18px 18px;
}

.sidebar--admin {
  border-right-color: #263141;
  background:
    radial-gradient(circle at 0% 14%, rgb(59 130 246 / 16%) 0, transparent 36%),
    radial-gradient(circle at 100% 88%, rgb(34 197 94 / 10%) 0, transparent 38%),
    linear-gradient(180deg, #151f32 0%, #111827 48%, #0f172a 100%);
}

.sidebar__brand {
  display: flex;
  min-height: 72px;
  align-items: center;
  margin: -4px -18px 28px;
  border-bottom: 1px solid rgb(211 220 234 / 74%);
  background: rgb(255 255 255 / 34%);
  padding: 0 26px 8px;
}

.sidebar--admin .sidebar__brand {
  border-bottom-color: rgb(148 163 184 / 16%);
  background: rgb(255 255 255 / 3%);
}

.sidebar__logo {
  display: flex;
  min-width: 0;
  align-items: center;
  color: #151924;
}

.sidebar--admin .sidebar__logo {
  color: #ffffff;
}

.sidebar__logo-text {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.sidebar__logo-text strong {
  overflow: hidden;
  color: inherit;
  font-size: 20px;
  font-weight: 950;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__logo-text strong span {
  color: #38a3ff;
}

.sidebar--admin .sidebar__logo-text strong span {
  color: #93c5fd;
}

.sidebar__logo-text small {
  color: #8b95a6;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.sidebar--admin .sidebar__logo-text small {
  color: #8491a5;
}

.sidebar__nav {
  display: grid;
  gap: 8px;
}

.sidebar__nav-item {
  display: flex;
  min-height: 46px;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 12px;
  color: #243047;
  font-size: 15px;
  font-weight: 850;
  padding: 0 13px;
  transition:
    background 140ms ease,
    color 140ms ease;
}

.sidebar--admin .sidebar__nav-item {
  color: #d7e0ec;
}

.sidebar__nav-item:hover {
  background: rgb(255 255 255 / 48%);
  color: #111827;
}

.sidebar--admin .sidebar__nav-item:hover {
  background: rgb(255 255 255 / 8%);
  color: #ffffff;
}

.sidebar__nav-item.is-active {
  background: transparent;
  color: #38a3ff;
  font-weight: 950;
}

.sidebar--admin .sidebar__nav-item.is-active {
  background: transparent;
  color: #93c5fd;
  font-weight: 950;
}

.sidebar__nav-label {
  display: inline-flex;
  width: fit-content;
  min-width: 0;
  overflow: hidden;
  border-bottom: 2px solid transparent;
  padding-bottom: 5px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__nav-item.is-active .sidebar__nav-label {
  border-bottom-color: #38a3ff;
}

.sidebar--admin .sidebar__nav-item.is-active .sidebar__nav-label {
  border-bottom-color: #93c5fd;
}

.sidebar__profile {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  border-radius: 14px;
  background: rgb(255 255 255 / 48%);
  padding: 12px 10px;
}

.sidebar--admin .sidebar__profile {
  background: rgb(255 255 255 / 8%);
}

.sidebar__profile-avatar {
  display: inline-grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef1ff 0%, #e6edf8 100%);
  color: #5360a8;
  font-size: 14px;
  font-weight: 950;
}

.sidebar--admin .sidebar__profile-avatar {
  background: rgb(255 255 255 / 14%);
  color: #dbeafe;
}

.sidebar__profile-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.sidebar__profile-label,
.sidebar__profile-copy > span:last-child {
  overflow: hidden;
  color: #7c8494;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar--admin .sidebar__profile-label,
.sidebar--admin .sidebar__profile-copy > span:last-child {
  color: #cbd5e1;
}

.sidebar__profile-copy strong {
  overflow: hidden;
  color: #172033;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar--admin .sidebar__profile-copy strong {
  color: #ffffff;
}

.sidebar__resize-handle {
  position: absolute;
  top: 0;
  right: -5px;
  bottom: 0;
  z-index: 3;
  width: 10px;
  cursor: col-resize;
  touch-action: none;
}

.sidebar__resize-handle::after {
  content: none;
}

.sidebar__resize-handle:hover::after {
  background: transparent;
}

.sidebar--admin .sidebar__resize-handle:hover::after {
  background: transparent;
}

.sidebar.is-resizing .sidebar__resize-handle::after {
  background: transparent;
}

.sidebar--admin.is-resizing .sidebar__resize-handle::after {
  background: transparent;
}

</style>
