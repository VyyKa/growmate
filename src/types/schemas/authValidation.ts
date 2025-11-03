import { z } from "zod"
import { emailSchema, passwordSchema, phoneSchema, fullNameSchema } from "./common"

// Login schema: allow login by phone or email, with password
export const loginSchema = z
	.object({
		phone: phoneSchema.optional().or(z.literal("")).optional(),
		email: emailSchema.optional().or(z.literal("")).optional(),
		password: passwordSchema,
		rememberMe: z.boolean().optional(),
	})
	.refine((data) => Boolean((data.phone && data.phone.trim()) || (data.email && data.email.trim())), {
		message: "Vui lòng nhập SĐT hoặc Email",
		path: ["phone"],
	})

export type LoginForm = z.infer<typeof loginSchema>

// Signup schema
export const signupSchema = z
	.object({
		fullName: fullNameSchema,
		phone: phoneSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu xác nhận không khớp",
		path: ["confirmPassword"],
	})

export type SignupForm = z.infer<typeof signupSchema>

// Forgot password schema
export const forgotPasswordSchema = z.object({
	email: emailSchema,
})

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

// Reset password schema
export const resetPasswordSchema = z
	.object({
		email: emailSchema,
		code: z.string().min(1, "Vui lòng nhập mã xác thực"),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu xác nhận không khớp",
		path: ["confirmPassword"],
	})

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

// Helper to parse errors into a simple field -> message map
export function parseZodErrors(err: unknown): Record<string, string> {
	if (err instanceof z.ZodError) {
		const map: Record<string, string> = {}
		for (const issue of err.issues) {
			const field = issue.path.join(".") || "form"
			if (!map[field]) map[field] = issue.message
		}
		return map
	}
	return {}
}

