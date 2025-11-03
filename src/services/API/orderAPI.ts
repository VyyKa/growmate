import axiosClient from "../axiosClient"
import type { OrderListResponse, Order } from "../../types/apiResponse/orderResponse"

// GET /api/Order - Get all orders for the current customer (Authenticated Customer)
export const getOrders = async () => {
	return axiosClient.get<OrderListResponse>(`/Order`)
}

// GET /api/Order/{orderId} - Get a specific order by ID (Authenticated Customer, own orders only)
export const getOrderById = async (orderId: number) => {
	return axiosClient.get<Order>(`/Order/${orderId}`)
}

// POST /api/Order - Create a new order from the customer's cart
export const createOrder = async (payload: { shippingAddress: string; notes: string }) => {
  return axiosClient.post<Order>(`/Order`, payload);
}

export default {
	getOrders,
	getOrderById,
  createOrder,
}

