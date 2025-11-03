export const ReportStatus = {
  Draft: 'draft',
  Published: 'published',
} as const
export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus]
