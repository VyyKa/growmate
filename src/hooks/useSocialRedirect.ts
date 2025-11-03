/**
 * useSocialRedirect
 * Hook chuẩn hoá logic gọi API social login (Google, Facebook, ...)
 * để lấy redirect URL và chuyển hướng người dùng một cách an toàn.
 *
 * Phụ thuộc: extractRedirectUrl (trích xuất URL từ nhiều dạng response)
 *
 * Trường hợp hỗ trợ:
 *  - API trả về { url } hoặc { redirectUrl }
 *  - API trả về { data: { url }} / { data: { redirectUrl }}
 *  - API trả về chuỗi URL thuần
 *  - Tuỳ chọn mở tab mới hoặc chuyển trang hiện tại
 *
 * Cách dùng cơ bản:
 * const { trigger, loading, error } = useSocialRedirect({
 *   provider: 'google',
 *   request: loginGoogle,   // hàm gọi API trả về Promise (axios request)
 * })
 * <button onClick={trigger}>Google</button>
 *
 * Tuỳ chọn nâng cao:
 * const hook = useSocialRedirect({
 *   provider: 'google',
 *   request: loginGoogle,
 *   openInNewTab: false,
 *   onBeforeRedirect: (url) => console.log('Redirecting to', url),
 *   onMissingUrl: () => toast.error('Không lấy được URL'),
 *   onError: (err) => toast.error('Lỗi mạng'),
 * })
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { extractRedirectUrl } from './extractRedirectUrl'

export interface UseSocialRedirectOptions<Resp = unknown> {
  /** Tên provider để logging hoặc telemetry */
  provider: string
  /** Hàm thực hiện request (ví dụ: () => loginGoogle()) */
  request: () => Promise<Resp>
  /** Tự động gọi khi mount (mặc định false) */
  auto?: boolean
  /** Mở trong tab mới thay vì thay đổi location hiện tại */
  openInNewTab?: boolean
  /** Cho phép custom window.open (ví dụ trong environment đặc biệt) */
  opener?: (url: string) => void
  /** Callback trước khi redirect (có thể dùng để tracking) */
  onBeforeRedirect?: (url: string) => void
  /** Callback khi không tìm thấy URL hợp lệ */
  onMissingUrl?: () => void
  /** Callback khi xảy ra lỗi */
  onError?: (error: unknown) => void
}

export interface UseSocialRedirectResult {
  trigger: () => Promise<void>
  loading: boolean
  error: string | null
  lastUrl?: string
}

export function useSocialRedirect<Resp = unknown>(options: UseSocialRedirectOptions<Resp>): UseSocialRedirectResult {
  const {
    request,
    provider,
    auto = false,
    openInNewTab = false,
    opener,
    onBeforeRedirect,
    onMissingUrl,
    onError,
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUrl, setLastUrl] = useState<string | undefined>(undefined)

  const trigger = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
  const response = await request()
  const maybeData = (response as unknown as { data?: unknown })?.data
  const redirect = extractRedirectUrl(maybeData ?? response)
      if (!redirect) {
        setError('MISSING_URL')
        onMissingUrl?.()
        return
      }
      setLastUrl(redirect)
      onBeforeRedirect?.(redirect)
      if (openInNewTab) {
        if (opener) opener(redirect)
        else window.open(redirect, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = redirect
      }
    } catch (e) {
      console.error(`[useSocialRedirect][${provider}]`, e)
      setError('REQUEST_FAILED')
      onError?.(e)
    } finally {
      setLoading(false)
    }
  }, [request, provider, openInNewTab, opener, onBeforeRedirect, onMissingUrl, onError])

  const autoRunRef = useRef(false)
  useEffect(() => {
    if (auto && !autoRunRef.current) {
      autoRunRef.current = true
      trigger()
    }
  }, [auto, trigger])

  return { trigger, loading, error, lastUrl }
}

export default useSocialRedirect
