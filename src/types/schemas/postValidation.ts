import { z } from "zod"

// Validation schema for creating a new post (tree adoption listing)
export const createPostSchema = z.object({
  productName: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(200, "Tên sản phẩm không được quá 200 ký tự"),
  
  productType: z
    .string()
    .min(1, "Loại sản phẩm không được để trống")
    .max(100, "Loại sản phẩm không được quá 100 ký tự"),
  
  productVariety: z
    .string()
    .min(1, "Giống sản phẩm không được để trống")
    .max(100, "Giống sản phẩm không được quá 100 ký tự"),
  
  farmName: z
    .string()
    .min(1, "Tên nhà vườn không được để trống")
    .max(200, "Tên nhà vườn không được quá 200 ký tự"),
  
  origin: z
    .string()
    .min(1, "Xuất xứ sản phẩm không được để trống")
    .max(200, "Xuất xứ không được quá 200 ký tự"),
  
  pricePerYear: z
    .number({ message: "Giá sản phẩm phải là số" })
    .positive("Giá sản phẩm phải lớn hơn 0")
    .max(999999999, "Giá sản phẩm quá lớn"),
  
  harvestWeight: z
    .number({ message: "Khối lượng thu hoạch phải là số" })
    .positive("Khối lượng thu hoạch phải lớn hơn 0")
    .max(100000, "Khối lượng thu hoạch quá lớn"),
  
  unit: z
    .string()
    .min(1, "Đơn vị không được để trống")
    .max(20, "Đơn vị không được quá 20 ký tự"),
  
  harvestFrequency: z
    .number({ message: "Tần suất thu hoạch phải là số" })
    .int("Tần suất thu hoạch phải là số nguyên")
    .positive("Tần suất thu hoạch phải lớn hơn 0")
    .max(365, "Tần suất thu hoạch không được quá 365 lần/năm"),
  
  treeQuantity: z
    .number({ message: "Số lượng cây phải là số" })
    .int("Số lượng cây phải là số nguyên")
    .positive("Số lượng cây phải lớn hơn 0")
    .max(10000, "Số lượng cây không được quá 10,000"),
  
  description: z
    .string()
    .min(10, "Mô tả sản phẩm phải có ít nhất 10 ký tự")
    .max(2000, "Mô tả sản phẩm không được quá 2000 ký tự"),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
