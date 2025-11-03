// Backend returns uppercase status strings. Keep const object for ergonomic access and a typed union.
export const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]
