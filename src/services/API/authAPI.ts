import axiosClient from "../axiosClient"
import type { LoginPayload, SignupPayload, VerifyEmailResponse } from "../../types/apiResponse/authResponse"
import type { ApiEnvelope } from "../../types/apiResponse/apiResponse"

const AUTH_BASE_URL = "auth"

export const login = async (email: string, password: string) => {
  return axiosClient.post<ApiEnvelope<LoginPayload>>(`${AUTH_BASE_URL}/login`, { email, password })
}

export const signup = async (fullName: string, email: string, password: string) => {
  return axiosClient.post<ApiEnvelope<SignupPayload>>(`${AUTH_BASE_URL}/register`, { fullName, email, password })
}

export const verifyEmail = async (email: string, code: string) => {
  return axiosClient.post<ApiEnvelope<VerifyEmailResponse>>(`${AUTH_BASE_URL}/verify-email`, { email, code })
}

export const resendVerificationCode = async (email: string) => {
  return axiosClient.post<ApiEnvelope<{ message: string }>>(`${AUTH_BASE_URL}/resend-verification`, { email })
}

export const loginGoogle = async () => {
  return axiosClient.get(`${AUTH_BASE_URL}/login-google`)
}

export const forgotPassword = async (email: string) => {
  return axiosClient.post<ApiEnvelope<{ message: string }>>(`${AUTH_BASE_URL}/forgot-password`, { email })
}

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  return axiosClient.post<ApiEnvelope<{ message: string }>>(`${AUTH_BASE_URL}/reset-password`, { 
    email, 
    code, 
    newPassword 
  })
}

