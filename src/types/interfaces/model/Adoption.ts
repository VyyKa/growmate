import type { AdoptionStatus } from "../../enums/AdoptionStatus"

/** Bảng adoptions */
export interface Adoption {
  adoptionId: number
  customerId: number
  treeId: number
  startDate: string
  endDate: string
  status: AdoptionStatus
  createdAt: string
}
