/**
 * extractRedirectUrl
 * Trích xuất URL chuyển hướng từ nhiều dạng response linh hoạt mà backend có thể trả về.
 * Hỗ trợ các trường hợp:
 *  - Response là chuỗi URL thuần: "https://..."
 *  - Object có field url hoặc redirectUrl
 *  - Object lồng thêm cấp data: { data: { url } } hoặc { data: { redirectUrl } }
 *  - Bỏ qua nếu không phải http(s)
 *
 * @param raw Giá trị trả về từ axios (res.data)
 * @returns URL hợp lệ hoặc undefined nếu không tìm thấy
 */
export function extractRedirectUrl(raw: unknown): string | undefined {
  if (typeof raw === 'string') {
    return raw.startsWith('http') ? raw : undefined
  }
  if (raw && typeof raw === 'object') {
    const obj = raw as { url?: unknown; redirectUrl?: unknown; data?: unknown }
    if (typeof obj.url === 'string') return obj.url
    if (typeof obj.redirectUrl === 'string') return obj.redirectUrl
    if (obj.data && typeof obj.data === 'object') {
      const nested = obj.data as { url?: unknown; redirectUrl?: unknown }
      if (typeof nested.url === 'string') return nested.url
      if (typeof nested.redirectUrl === 'string') return nested.redirectUrl
    }
  }
  return undefined
}
