import type { OrderStatus } from "../../enums/OrderStatus"
import type { PaymentStatus } from "../../enums/PaymentStatus"
import type { Adoption } from "./Adoption"
import type { Customer } from "./Customer"
import type { Farmer } from "./Farmer"
import type { Payment } from "./Payment"
import type { Shipment } from "./Shipment"
import type { AnyOrderItem } from "../../apiResponse/orderResponse"

// Frontend model mapped from backend EF Core Order entity
// Field names are camelCased to follow TS conventions
export interface Order {
	orderId: number
	customerId: number
	sellerId: number

	shipFullName: string
	shipPhone: string
	shipAddress: string
	shipCity: string
	shipState: string
	shipPostalCode: string
	shipCountry: string

	subtotal: number
	shippingFee: number
	totalAmount: number
	currency: string

	status: OrderStatus
	paymentStatus: PaymentStatus
	note: string | null

	createdAt: string
	updatedAt: string

	orderType: string

	// Navigation properties (optional depending on API shape)
	adoptions?: Adoption[]
	customer?: Customer
	orderItems?: AnyOrderItem[]
	payments?: Payment[]
	seller?: Farmer
		shipments?: Shipment[]
}
