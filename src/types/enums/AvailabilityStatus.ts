export const AvailabilityStatus = {
  Available: 'available',
  Adopted: 'adopted',
  Maintenance: 'maintenance',
} as const
export type AvailabilityStatus = typeof AvailabilityStatus[keyof typeof AvailabilityStatus]
