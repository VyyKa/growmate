/**
 * Lấy ra thông báo lỗi đầu tiên từ object errors (thường dùng cho lỗi validate field)
 */
export function firstFromErrors(errors?: Record<string, string[] | string>): string | undefined {
  if (!errors || typeof errors !== "object") 
    return undefined;
  for (const key of Object.keys(errors)) {
    const v = errors[key];
    if (Array.isArray(v) && v.length) 
      return v[0];
    if (typeof v === "string" && v.trim()) 
      return v;
  }
  return undefined;
}

/**
 * Lấy giá trị string đầu tiên không rỗng trong danh sách truyền vào (ưu tiên string, sau đó là phần tử đầu của mảng string)
 */
export function coalesce(...vals: Array<unknown>): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) 
      return v;
    if (Array.isArray(v) && v.length && typeof v[0] === "string") 
      return v[0] as string;
  }
  return undefined;
}
