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
  gender: string
  age: number
  birthDate: string
  customerStageCode: string
  customerStageName: string
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

export interface SalesPage {
  page: number
  size: number
  totalCount: number
  totalPages: number
  items: SalesCustomer[]
}

export interface SalesSearchParams {
  customerName?: string
  age?: number
  gender?: 'Male' | 'Female'
  contractStatusCodes?: string[]
  hasReport?: boolean
  hasThreeStep?: boolean
  page: number
  size: number
}

// 검색 폼에서는 페이지 정보를 제외한 필터 조건만 관리
export type SalesSearchFilters = Omit<SalesSearchParams, 'page' | 'size'>

// 선택한 연월의 계약 목표와 달성률을 조회한다.
export async function getSalesSummary(targetYearMonth: string) {
  const response = await api.get<ApiResponse<SalesSummary>>('/api/v1/sales/performance/summary', {
    params: { targetYearMonth },
  })

  return response.data.data
}

export async function getSalesList(params: SalesSearchParams) {
  // Spring의 List 파라미터가 받을 수 있도록 상태 코드를 쉼표 구분 문자열로 변환
  const requestParams = {
    ...params,
    contractStatusCodes: params.contractStatusCodes?.join(','),
  }
  const response = await api.get<ApiResponse<SalesPage>>('/api/v1/sales/performance/contracts', {
    params: requestParams,
  })

  return response.data.data
}
