import type { AvailabilityStatus } from "../../enums/AvailabilityStatus"
import type { TreeHealthStatus } from "../../enums/TreeHealthStatus"

/** Bảng trees */
export interface Tree {
  treeId: number
  listingId: number
  uniqueCode: string
  description?: string | null
  coordinates?: string | null
  healthStatus: TreeHealthStatus
  availabilityStatus: AvailabilityStatus
  createdAt: string
}
