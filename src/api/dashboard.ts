import api, { type ApiResponse } from '@/api/instance'

export type DashboardBadgeColor = 'RED' | 'ORANGE' | 'YELLOW' | string

export interface DashboardSummary {
  uncontactedCustomerCount: number
  consultingCustomerCount: number
  designingContractCount: number
  designedContractCount: number
  subscriptionInProgressCount: number
  subscriptionCompletedCount: number
  paymentCompletedCount: number
  contractCompletedCount: number
}

export interface DashboardAchievement {
  targetContractCount: number
  completedContractCount: number
  achievementRate: number
}

export interface ContactCustomer {
  actionItemId: number
  potentialCustomerId: number
  customerName: string
  gender: string
  age: number
  birthDate: string
  insuranceAgeShiftDate: string
  ageChangeLabel: string
  badgeName: string
  badgeColor: DashboardBadgeColor
  consultStatusCode: string
  consultStatusName: string
  webFormSendEnabled: boolean
  webFormStatusCode: string
  webFormStatusName: string
  reportId?: number
  reportSendEnabled: boolean
  reportSendStatusCode: string
  reportSendStatusName: string
  priorityScore: number
}

export interface WebformSendResponse {
  issuanceId: number
  customerId: number
  conversionStatusCode: string
  uuidToken: string
  webformStatusCode: string
  webformStatusName: string
  issuedAt: string
}

export async function getDashboardSummary() {
  const response = await api.get<ApiResponse<DashboardSummary>>(
    '/v1/dashboard/summary',
  )

  return response.data.data
}

export async function getDashboardAchievement() {
  const response = await api.get<ApiResponse<DashboardAchievement>>(
    '/v1/dashboard/achievement',
  )

  return response.data.data
}

export async function getTodayContactCustomers() {
  const response = await api.get<ApiResponse<ContactCustomer[]>>(
    '/v1/dashboard/contact-customers',
  )

  return response.data.data
}

export async function sendDashboardWebform(potentialCustomerId: number) {
  const response = await api.post<ApiResponse<WebformSendResponse>>(
    `/v1/webforms/DASHBOARD/01/${potentialCustomerId}/send`,
  )

  return response.data.data
}

export async function sendDashboardWebformsInBulk() {
  const response = await api.post<ApiResponse<WebformSendResponse[]>>(
    '/v1/webforms/send/bulk',
  )

  return response.data.data
}