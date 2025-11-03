import type { User } from "../interfaces/model/User"

export type LoginPayload = { 
    token: string; 
    user: User 
}

export type SignupPayload = { 
    token: string; 
    user: User 
}

export type VerifyEmailResponse = {
    success: boolean
    message: string
}
