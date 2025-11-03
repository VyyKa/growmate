import { z } from "zod"
import { emailSchema, phoneSchema, fullNameSchema } from "./common"

const addressSchema = z
  .string()
  .trim()
  .min(10, { message: "Địa chỉ phải có ít nhất 10 ký tự" })
  .max(200, { message: "Địa chỉ quá dài (tối đa 200 ký tự)" })

const noteSchema = z
  .string()
  .trim()
  .max(500, { message: "Ghi chú quá dài (tối đa 500 ký tự)" })
  .optional()

export const shippingSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneSchema,
  email: emailSchema,
  province: z.string().min(1, { message: "Vui lòng chọn Tỉnh/Thành phố" }),
  district: z.string().min(1, { message: "Vui lòng chọn Quận/Huyện" }),
  ward: z.string().min(1, { message: "Vui lòng chọn Phường/Xã/Thị trấn" }),
  address: addressSchema,
  note: noteSchema,
})

export type ShippingForm = z.infer<typeof shippingSchema>
