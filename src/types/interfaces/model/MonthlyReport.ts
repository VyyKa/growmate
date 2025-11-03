import type { ReportStatus } from "../../enums/ReportStatus"

/** Bảng monthly_reports */
export interface MonthlyReport {
  reportId: number
  adoptionId: number
  farmerId: number
  reportMonth: number
  reportYear: number
  activities: string
  notes?: string | null
  status: ReportStatus
  createdAt: string
  publishedAt?: string | null
}
