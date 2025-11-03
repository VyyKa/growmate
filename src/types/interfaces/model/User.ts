export interface User {
    userId: number
    email: string
    password: string
    fullName: string
    phone?: string | null
    role: number
    profileImageUrl?: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}
