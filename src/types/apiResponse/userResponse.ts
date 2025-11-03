import type { User } from "../interfaces/model/User"

// Types for GET /users
export type GetUsersQuery = {
  id?: number
  email?: string
  phone?: string
  includeCustomer?: boolean
  page?: number
  pageSize?: number
}

export type UserWithRelations = User & {
  roleName?: string
  customer?: {
    customerId: number
    shippingAddress: string | null
    walletBalance: number
  } | null
  farmer?: {
    farmerId?: number
    farmName?: string | null
    farmAddress?: string | null
    contactPhone?: string | null
    verificationStatus?: string | null
  } | null
}

export type UsersListResponse = {
  items: UserWithRelations[]
  page: number
  pageSize: number
  total: number
}

export default {} as const

// Admin update types for PUT /users/by-admin/{id}
export type AdminUpdateUserRequest = {
  email?: string
  fullName?: string
  phone?: string
  profileImageUrl?: string
  updateCustomer?: {
    shippingAddress?: string
    walletBalance?: number
  }
  updateFarmer?: {
    farmName?: string | null
    farmAddress?: string | null
    contactPhone?: string | null
    verificationStatus?: string | null
  }
  role?: number
  isActive?: boolean
}

export type AdminUpdateUserResponse = {
  message: string
  success: boolean
}

// Admin create types for POST /users/by-admin
export type AdminCreateUserRequest = {
  email: string
  password: string
  fullName: string
  phone?: string
  role?: number
  profileImageUrl?: string
  customerRequest?: {
    shippingAddress?: string
    walletBalance?: number
  }
  farmerRequest?: {
    farmName?: string | null
    farmAddress?: string | null
    contactPhone?: string | null
    verificationStatus?: string | null
  }
}

export type AdminCreateUserResponse = {
  message: string
  success: boolean
}
