export const CameraStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const
export type CameraStatus = typeof CameraStatus[keyof typeof CameraStatus]
