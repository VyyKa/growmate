/** Bảng customers */
export interface Customer {
  customerId: number
  shippingAddress?: string | null
  walletBalance: number
  createdAt: string
}
