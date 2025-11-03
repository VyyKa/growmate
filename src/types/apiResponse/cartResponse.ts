// Types for Cart API: GET /api/Cart (current authenticated customer's cart)
import type { Cart as CartModel } from "../interfaces/model/Cart"
import type { CartItem as CartItemModel } from "../interfaces/model/CartItem"

export type CartItem = CartItemModel & {
  // Additional fields returned by the API for display
  productName: string
  unitPriceFormatted: string
  totalPrice: number
  totalPriceFormatted: string
  productImageUrl: string | null
  years: number | null
}

export type CartDetail = CartModel & {
  cartItems: CartItem[]
  totalItems: number
  subtotal: number
  subtotalFormatted: string
}

// When cart is empty and user has never added anything before
export type EmptyCartMessage = {
  message: string // "Your cart is empty."
}

// Union of all possible responses from GET /api/Cart
export type CartGetResponse = CartDetail | EmptyCartMessage

// Type guards
export const isEmptyCartMessage = (data: CartGetResponse): data is EmptyCartMessage => {
  return (data as EmptyCartMessage).message !== undefined
}

export const isCartDetail = (data: CartGetResponse): data is CartDetail => {
  return (data as CartDetail).cartId !== undefined
}

// ---- Mutations ----
export type AddCartItemPayload = {
  productId: number
  quantity: number
}

export type UpdateCartItemPayload = {
  quantity: number
  years?: number
}

// Add a tree listing (adoption) to cart
export type AddTreeListingPayload = {
  listingId: number
  quantity: number
  years: number
}

