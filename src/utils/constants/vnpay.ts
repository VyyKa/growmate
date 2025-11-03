/**
 * VNPay Payment Gateway Constants
 * Documentation: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 */

// VNPay Bank Codes for Internet Banking
export const VNPAY_BANK_CODES = {
  VIETCOMBANK: "VCB",
  VIETINBANK: "CTG",
  BIDV: "BIDV",
  AGRIBANK: "AGRIBANK",
  SACOMBANK: "SACOMBANK",
  TECHCOMBANK: "TCB",
  MBBANK: "MB",
  VPBANK: "VPB",
  ACB: "ACB",
  TPBANK: "TPB",
  DONGABANK: "DAB",
  EXIMBANK: "EIB",
  HDBANK: "HDB",
  LIENVIETPOSTBANK: "LPB",
  MARITIMEBANK: "MSB",
  NAMABANK: "NAB",
  OCEANBANK: "OCB",
  PGBANK: "PGB",
  PVCOMBANK: "PVCB",
  SAIGONBANK: "SGB",
  SCB: "SCB",
  SEABANK: "SEAB",
  SHB: "SHB",
  VIETABANK: "VAB",
  VIETBANK: "VIB",
  VIETCAPITALBANK: "VCCB",
  ABBANK: "ABB",
  BAOVIETBANK: "BVB",
  GPBANK: "GPB",
  KIENLONGBANK: "KLB",
  NCB: "NCB",
  OCEANBANK_NEW: "OJB",
  PUBLICBANK: "PUB",
  TRUSTBANK: "VIETBANK",
  WOORIBANK: "WRB",
  SHINHANBANK: "SHBVN",
  STANDARDCHARTERED: "SCVN",
} as const

export type VNPayBankCode = (typeof VNPAY_BANK_CODES)[keyof typeof VNPAY_BANK_CODES]

// Bank information with logos
export interface BankInfo {
  code: VNPayBankCode
  name: string
  shortName: string
  logo?: string
}

export const VNPAY_BANKS: BankInfo[] = [
  { code: "VCB", name: "Ngân hàng TMCP Ngoại Thương Việt Nam", shortName: "Vietcombank" },
  { code: "CTG", name: "Ngân hàng TMCP Công Thương Việt Nam", shortName: "VietinBank" },
  { code: "BIDV", name: "Ngân hàng TMCP Đầu Tư và Phát Triển Việt Nam", shortName: "BIDV" },
  { code: "AGRIBANK", name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", shortName: "Agribank" },
  { code: "TCB", name: "Ngân hàng TMCP Kỹ Thương Việt Nam", shortName: "Techcombank" },
  { code: "MB", name: "Ngân hàng TMCP Quân Đội", shortName: "MBBank" },
  { code: "VPB", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", shortName: "VPBank" },
  { code: "ACB", name: "Ngân hàng TMCP Á Châu", shortName: "ACB" },
  { code: "TPB", name: "Ngân hàng TMCP Tiên Phong", shortName: "TPBank" },
  { code: "SACOMBANK", name: "Ngân hàng TMCP Sài Gòn Thương Tín", shortName: "Sacombank" },
  { code: "HDB", name: "Ngân hàng TMCP Phát triển TP. HCM", shortName: "HDBank" },
  { code: "MSB", name: "Ngân hàng TMCP Hàng Hải", shortName: "MSB" },
  { code: "OCB", name: "Ngân hàng TMCP Phương Đông", shortName: "OCB" },
  { code: "SHB", name: "Ngân hàng TMCP Sài Gòn - Hà Nội", shortName: "SHB" },
  { code: "LPB", name: "Ngân hàng TMCP Bưu Điện Liên Việt", shortName: "LienVietPostBank" },
  { code: "SEAB", name: "Ngân hàng TMCP Đông Nam Á", shortName: "SeABank" },
  { code: "VIB", name: "Ngân hàng TMCP Quốc Tế", shortName: "VIB" },
  { code: "SCB", name: "Ngân hàng TMCP Sài Gòn", shortName: "SCB" },
  { code: "ABB", name: "Ngân hàng TMCP An Bình", shortName: "ABBank" },
  { code: "NCB", name: "Ngân hàng TMCP Quốc Dân", shortName: "NCB" },
]

// VNPay Response Codes
export const VNPAY_RESPONSE_CODES = {
  SUCCESS: "00",
  TRANSACTION_NOT_COMPLETE: "01",
  TRANSACTION_ERROR: "02",
  REVERSED_TRANSACTION: "04",
  PROCESSING_REFUND: "05",
  REFUND_SENT_TO_BANK: "06",
  FRAUD_SUSPECTED: "07",
  NOT_REGISTERED_INTERNET_BANKING: "09",
  WRONG_AUTHENTICATION: "10",
  TIMEOUT: "11",
  ACCOUNT_LOCKED: "12",
  WRONG_OTP: "13",
  CUSTOMER_CANCELLED: "24",
  INSUFFICIENT_BALANCE: "51",
  EXCEED_TRANSACTION_LIMIT: "65",
  BANK_MAINTENANCE: "75",
  WRONG_PASSWORD_LIMIT_EXCEEDED: "79",
  OTHER_ERROR: "99",
} as const

// VNPay Error Messages in Vietnamese
export const VNPAY_ERROR_MESSAGES: Record<string, string> = {
  "00": "Giao dịch thành công",
  "01": "Giao dịch chưa hoàn tất",
  "02": "Giao dịch bị lỗi",
  "04": "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)",
  "05": "VNPAY đang xử lý giao dịch này (GD hoàn tiền)",
  "06": "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)",
  "07": "Giao dịch bị nghi ngờ gian lận",
  "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking tại ngân hàng",
  "10": "Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
  "11": "Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch",
  "12": "Thẻ/Tài khoản của khách hàng bị khóa",
  "13": "Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch",
  "24": "Khách hàng hủy giao dịch",
  "51": "Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
  "65": "Tài khoản của quý khách đã vượt quá hạn mức giao dịch trong ngày",
  "75": "Ngân hàng thanh toán đang bảo trì",
  "79": "KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
  "99": "Lỗi không xác định",
}

// Payment method types
export type PaymentMethodType = "qr" | "atm"

// VNPay Configuration (to be set via environment variables)
export const VNPAY_CONFIG = {
  VERSION: "2.1.0",
  COMMAND: "pay",
  LOCALE: "vn",
  CURRENCY_CODE: "VND",
  ORDER_TYPE: "other",
} as const
