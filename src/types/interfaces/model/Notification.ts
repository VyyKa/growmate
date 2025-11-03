import type { NotificationType } from "../../enums/NotificationType"

/** Bảng notifications */
export interface Notification {
  notificationId: number
  userId: number
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}
