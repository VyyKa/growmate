import type { Order as OrderModel } from "../interfaces/model/Order"
import type { OrderItem as OrderItemModel } from "../interfaces/model/OrderItem"
import type { Shipment } from "../interfaces/model/Shipment"
import type { OrderStatus } from "../enums/OrderStatus"
import type { PaymentStatus } from "../enums/PaymentStatus"

export type ProductOrderItem = OrderItemModel & {
  $type: "Product"
  itemType: "Product"
  unitPriceFormatted: string
  totalPrice: number
  totalPriceFormatted: string
  totalPriceFromDb: number
  totalPriceFromDbFormatted: string
  createdAt: string
  productImageUrl: string
}

export type TreeOrderItem = OrderItemModel & {
  $type: "Tree"
  itemType: "Tree"
  productType: string
  productVariety: string
  farmName: string
  // Overrides and formatted fields from API
  treeQuantity: number
  treeUnitPrice: number
  treeUnitPriceFormatted: string
  treeTotalPrice: number
  treeTotalPriceFormatted: string
  treeTotalPriceFromDb: number
  treeTotalPriceFromDbFormatted: string
  createdAt: string
  productImageUrl: string
}

export type AnyOrderItem = ProductOrderItem | TreeOrderItem

export type Order = OrderModel & {
  customerName: string
  sellerName: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  currency: string
  subtotal: number
  subtotalFormatted: string
  shippingFee: number
  shippingFeeFormatted: string
  platformFee: number
  platformFeeFormatted: string
  totalAmount: number
  totalAmountFormatted: string
  sellerAmount: number
  sellerAmountFormatted: string
  shippingAddress: string
  notes: string | null
  paymentMethod: string | null
  orderItems: AnyOrderItem[]
  shipments?: Shipment[]
}

export type OrderListResponse = Order[]
