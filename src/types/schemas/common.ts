import { z } from "zod"

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
  .max(100, { message: "Họ và tên quá dài" })

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\d{9,15}$/, { message: "Số điện thoại không hợp lệ" })

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Email không hợp lệ" })

export const passwordSchema = z
  .string()
  .min(1, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  .max(128, { message: "Mật khẩu quá dài" })

export const messageSchema = z
  .string()
  .trim()
  .min(10, { message: "Nội dung phải có ít nhất 10 ký tự" })
  .max(1000, { message: "Nội dung quá dài (tối đa 1000 ký tự)" })
