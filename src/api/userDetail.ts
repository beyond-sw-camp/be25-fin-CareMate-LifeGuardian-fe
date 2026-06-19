import api, { type ApiResponse } from '@/api/instance'

export interface UserDetailBadge {
  code: string
  name: string
}

export interface UserDetail {
  customerId: number
  conversionStatusCode: string
  conversionStatusName: string
  reportUrl?: string
  childName: string
  childGender: string
  childAge: number
  childBirthDate: string
  consultStatusCode?: string
  consultStatusName?: string
  lifeStageCode?: string
  lifeStageName?: string
  insuranceAgeShiftDate?: string
  parentCustomerId?: number
  guardianName?: string
  relationshipCode?: string
  relationshipName?: string
  guardianPhone?: string
  guardianAddress?: string
  guardianAge?: number
  badges: UserDetailBadge[]
}

export async function getUserDetail(customerId: number, conversionStatusCode: string) {
  const response = await api.get<ApiResponse<UserDetail>>(`/v1/customers/${customerId}/detail`, {
    params: { conversionStatusCode },
  })

  return response.data.data
}
