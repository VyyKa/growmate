import type { CameraStatus } from "../../enums/CameraStatus"

/** Bảng cameras */
export interface Camera {
  cameraId: number
  treeId: number
  rtmpUrl?: string | null
  hlsUrl?: string | null
  status: CameraStatus
  createdAt: string
}
