import axiosClient from "../axiosClient"
import type { CartGetResponse, AddCartItemPayload, UpdateCartItemPayload, AddTreeListingPayload } from "../../types/apiResponse/cartResponse"

// GET /api/Cart - Get the current customer's shopping cart (Authenticated Customer)
export const getCurrentCart = async () => {
	return axiosClient.get<CartGetResponse>(`/Cart`)
}

// POST /api/Cart/items - Add a product to the customer's cart (Authenticated Customer)
export const addItemToCart = async (payload: AddCartItemPayload) => {
  return axiosClient.post(`/Cart/items`, payload)
}

// PUT /api/Cart/items/{cartItemId} - Update the quantity of an item in the cart
export const updateCartItemQuantity = async (cartItemId: number, payload: UpdateCartItemPayload) => {
	return axiosClient.put(`/Cart/items/${cartItemId}`, payload)
}

// DELETE /api/Cart/items/{cartItemId} - Remove an item from the cart
export const removeCartItem = async (cartItemId: number) => {
	return axiosClient.delete(`/Cart/items/${cartItemId}`)
}

// POST /api/Cart/trees - Add a tree listing (adoption) to the customer's cart
export const addTreeListingToCart = async (payload: AddTreeListingPayload) => {
	return axiosClient.post(`/Cart/trees`, payload)
}

export default {
	getCurrentCart,
 	addItemToCart,
	updateCartItemQuantity,
	removeCartItem,
	addTreeListingToCart,
}

