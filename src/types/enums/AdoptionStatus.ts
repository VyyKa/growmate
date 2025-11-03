// Align with backend: uppercase status strings
export const AdoptionStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type AdoptionStatus = typeof AdoptionStatus[keyof typeof AdoptionStatus]

// Filter includes ALL plus concrete statuses
export const AdoptionFilter = {
  ALL: 'ALL',
  ...AdoptionStatus,
} as const

export type AdoptionFilterStatus = typeof AdoptionFilter[keyof typeof AdoptionFilter]

export const ADOPTION_STATUS_LABELS: Record<AdoptionStatus, string> = {
  ACTIVE: 'Đang nuôi',
  PENDING: 'Chờ xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

export const ADOPTION_STATUS_BADGE_CLASSES: Record<AdoptionStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-300',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  COMPLETED: 'bg-blue-100 text-blue-700 border-blue-300',
  CANCELLED: 'bg-red-100 text-red-700 border-red-300',
}

export function getAdoptionStatusText(status: string): string {
  const key = status.toUpperCase() as AdoptionStatus
  return ADOPTION_STATUS_LABELS[key] ?? status
}

export function getAdoptionStatusColor(status: string): string {
  const key = status.toUpperCase() as AdoptionStatus
  return (
    ADOPTION_STATUS_BADGE_CLASSES[key] ?? 'bg-gray-100 text-gray-700 border-gray-300'
  )
}
