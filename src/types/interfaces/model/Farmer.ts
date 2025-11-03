import type { VerificationStatus } from "../../enums/VerificationStatus"

/** Bảng farmers */
export interface Farmer {
  farmerId: number
  farmName: string
  farmAddress: string
  contactPhone?: string | null
  verificationStatus: VerificationStatus
  createdAt: string
}
