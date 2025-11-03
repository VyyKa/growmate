export const MediaType = {
  PostImage: 'postImage',
  PostVideo: 'postVideo',
  MonthlyReportImage: 'monthlyReportImage',
  MonthlyReportVideo: 'monthlyReportVideo',
  Other: 'other',
} as const
export type MediaType = typeof MediaType[keyof typeof MediaType]
