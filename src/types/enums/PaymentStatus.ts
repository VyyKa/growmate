// Backend returns uppercase status strings. Keep const object for ergonomic access and a typed union.
export const PaymentStatus = {
  PENDING: 'Chờ xác thực',
  COMPLETED: 'Đã hoàn thành',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
} as const

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]
