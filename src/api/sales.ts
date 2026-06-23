import api, { type ApiResponse } from '@/api/instance'

export interface SalesSummary {
  year: number
  month: number
  targetCount: number
  contractCount: number
  achievementRate: number
}

export interface SalesCustomer {
  customerId: number
  customerName: string
  customerStageCode: SalesCustomerStageCode
  customerStageName: string
  gender: string
  age: number
  birthDate: string
  insuranceAgeShiftDate?: string
  ageIncreaseDDay?: number
  threeStepCode?: string
  threeStepName: string
  consultStatusCode?: string
  consultStatusName: string
  contractId?: number
  contractStatusCode?: string
  contractStatusName: string
  insuranceName: string
  insuredName: string
  webFormId?: number
  webformReceivedAt: string
  webFormStatusCode?: string
  webFormStatusName?: string
  webformStatusCode?: string
  webformStatusName?: string
  reportId?: number
  reportUrl?: string
  hasReport: boolean
  reportStatusCode?: string
  reportStatusName: string
  reportSentAt?: string
  canSendReport: boolean
  sortRank: number
}

export type SalesCustomerStageCode = '01' | '02'

const CUSTOMER_STAGE_NAMES: Record<SalesCustomerStageCode, string> = {
  '01': '잠재 고객',
  '02': '통합 고객',
}

export const resolveSalesCustomerStageCode = (customer: SalesCustomer): SalesCustomerStageCode | '' => {
  return customer.customerStageCode
}

export const resolveSalesCustomerStageName = (customer: SalesCustomer) => {
  return customer.customerStageName || CUSTOMER_STAGE_NAMES[customer.customerStageCode] || '-'
}

export interface SalesPage {
  page: number
  size: number
  totalCount: number
  totalPages: number
  items: SalesCustomer[]
}

export interface ReportSendResult {
  customerId: number
  customerName: string
  sendStatusCode: string
  sendStatusName: string
  sentAt: string
}

export interface BulkSendResult {
  requestedCount: number
  successCount: number
  skippedCount: number
  failedCount: number
  sentAt: string
}

export interface WebformSendResult {
  issuanceId?: number
  customerId: number
  conversionStatusCode: string
  uuidToken: string
  webformStatusCode: string
  webformStatusName: string
  issuedAt: string
}

export interface ReportBulkSendRequest {
  reportIds?: number[]
}

export interface SalesSearchParams {
  customerName?: string
  age?: number
  gender?: 'Male' | 'Female'
  customerStageCode?: SalesCustomerStageCode
  consultStatusCode?: string[]
  contractStatusCode?: string[]
  hasReport?: boolean
  hasThreeStep?: boolean
  page: number
  size: number
}

export type SalesSearchFilters = Omit<SalesSearchParams, 'page' | 'size'>

const serializeSalesSearchParams = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item))
      return
    }

    searchParams.append(key, String(value))
  })

  return searchParams.toString()
}

export async function getSalesSummary(targetYearMonth: string) {
  const response = await api.get<ApiResponse<SalesSummary>>('/v1/sales/performance/summary', {
    params: { targetYearMonth },
  })

  return response.data.data
}

export async function getSalesList(params: SalesSearchParams) {
  const response = await api.get<ApiResponse<SalesPage>>('/v1/sales/performance/contracts', {
    params,
    paramsSerializer: serializeSalesSearchParams,
  })

  return response.data.data
}

export async function sendCustomerReport(customerId: number) {
  const response = await api.post<ApiResponse<ReportSendResult>>(
    `/v1/reports/${customerId}/send`,
  )

  return response.data.data
}

export async function sendCustomerReportsInBulk(reportIds?: number[]) {
  const data: ReportBulkSendRequest = reportIds?.length ? { reportIds } : {}
  const response = await api.post<ApiResponse<BulkSendResult>>(
    '/v1/reports/send/bulk',
    data,
  )

  return response.data.data
}

export async function sendCustomerWebform(customerId: number, conversionStatusCode: string) {
  const response = await api.post<ApiResponse<WebformSendResult>>(
    `/v1/webforms/SALES_STATUS/${conversionStatusCode}/${customerId}/send`,
  )

  return response.data.data
}

export async function sendCustomerWebformsInBulk() {
  const response = await api.post<ApiResponse<WebformSendResult[]>>(
    '/v1/webforms/sales-status/send/bulk',
  )

  return response.data.data
}
