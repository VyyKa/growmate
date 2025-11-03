import axiosClient from "../axiosClient"
import type { GetUsersQuery, UserWithRelations, UsersListResponse, AdminUpdateUserRequest, AdminUpdateUserResponse, AdminCreateUserRequest, AdminCreateUserResponse } from "../../types/apiResponse/userResponse"

/**
 * Update user profile (self or admin)
 * PUT /api/users/{id}
 * @param userId - User ID
 * @param data - Profile fields to update
 */
export const updateProfile = async (
	userId: number,
	data: {
		email?: string
		fullName?: string
		phone?: string
		profileImageUrl?: string
		updateCustomer?: {
			shippingAddress?: string
			walletBalance?: number
		}
		updateFarmer?: {
			farmName?: string
			farmAddress?: string
			contactPhone?: string
			verificationStatus?: string
		}
	}
) => {
	const res = await axiosClient.put(`/users/${userId}`, data)
	return res.data as { message: string }
}

/**
 * Get user(s) by id/email/phone or list with pagination
 * - Admin: can query all users
 * - Non-admin: can only get their own profile
 */
export const getUsers = async (params?: GetUsersQuery): Promise<UserWithRelations | UsersListResponse> => {
	const res = await axiosClient.get("/users", { params })
	return res.data as UserWithRelations | UsersListResponse
}

/**
 * Admin: Update any user (role, active status, etc.)
 * PUT /api/users/by-admin/{id}
 */
export const updateUserByAdmin = async (
	userId: number,
	data: AdminUpdateUserRequest
): Promise<AdminUpdateUserResponse> => {
	const res = await axiosClient.put(`/users/by-admin/${userId}`, data)
	return res.data as AdminUpdateUserResponse
}

/**
 * Admin: Create a new user
 * POST /api/users/by-admin
 */
export const createUserByAdmin = async (
  data: AdminCreateUserRequest
): Promise<AdminCreateUserResponse> => {
  const res = await axiosClient.post("/users/by-admin", data)
  return res.data as AdminCreateUserResponse
}
