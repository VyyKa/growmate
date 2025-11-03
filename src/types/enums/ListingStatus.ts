export const ListingStatus = {
  Active: 'active',
  SoldOut: 'sold_out',
  Draft: 'draft',
} as const
export type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus]
