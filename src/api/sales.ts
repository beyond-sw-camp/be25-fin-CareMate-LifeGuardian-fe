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
  statusCode?: '01' | '02' | string
  statusName?: string
  customerStageCode?: '01' | '02' | string
  customerStageName?: string
  conversionStatusCode?: '01' | '02' | string
  conversionStatusName?: string
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
  webformReceivedAt: string
  reportId?: number
  hasReport: boolean
  reportStatusCode?: string
  reportStatusName: string
  canSendReport: boolean
  sortRank: number
}

export type SalesCustomerStageCode = '01' | '02'

const CUSTOMER_STAGE_NAMES: Record<SalesCustomerStageCode, string> = {
  '01': '잠재 고객',
  '02': '통합 고객',
}

const isSalesCustomerStageCode = (code?: string): code is SalesCustomerStageCode =>
  code === '01' || code === '02'

const resolveCustomerStageNameCandidate = (customer: SalesCustomer) =>
  customer.customerStageName ?? customer.conversionStatusName ?? customer.statusName

export const resolveSalesCustomerStageCode = (customer: SalesCustomer): SalesCustomerStageCode | '' => {
  const code = customer.customerStageCode ?? customer.conversionStatusCode ?? customer.statusCode
  if (isSalesCustomerStageCode(code)) return code

  const name = resolveCustomerStageNameCandidate(customer)
  if (name?.includes('잠재')) return '01'
  if (name?.includes('통합')) return '02'

  return ''
}

export const resolveSalesCustomerStageName = (customer: SalesCustomer) => {
  const name = resolveCustomerStageNameCandidate(customer)
  if (name) return name

  const code = resolveSalesCustomerStageCode(customer)
  return code ? CUSTOMER_STAGE_NAMES[code] : '-'
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

export interface ReportBulkSendResult {
  requestedCount: number
  successCount: number
  failedCount: number
  sentAt: string
}

export interface SalesSearchParams {
  customerName?: string
  age?: number
  gender?: 'Male' | 'Female'
  consultStatusCodes?: string[]
  contractStatusCodes?: string[]
  hasReport?: boolean
  hasThreeStep?: boolean
  page: number
  size: number
}

export type SalesSearchFilters = Omit<SalesSearchParams, 'page' | 'size'>

const serializeSalesSearchParams = (params: SalesSearchParams) => {
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

export async function sendCustomerReportsInBulk() {
  const response = await api.post<ApiResponse<ReportBulkSendResult>>(
    '/v1/reports/send/bulk',
  )

  return response.data.data
}
