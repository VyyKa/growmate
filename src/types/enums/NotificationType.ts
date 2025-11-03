export const NotificationType = {
  PaymentReminder: 'payment_reminder',
  ReportAvailable: 'report_available',
  TreeUpdate: 'tree_update',
  System: 'system',
} as const
export type NotificationType = typeof NotificationType[keyof typeof NotificationType]
