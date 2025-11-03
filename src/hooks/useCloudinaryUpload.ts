import { useState, useCallback } from "react"

type UploadOptions = {
  cloudName?: string
  preset?: string
  folder?: string
}

export type UploadResult = {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
}

export const useCloudinaryUpload = (options?: UploadOptions) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    const CLOUD_NAME = options?.cloudName ?? (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined)
    // Prefer specific avatar preset if present, then generic preset, then passed option
    const PRESET_ENV = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_AVATAR as string | undefined) ??
      (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined)
    const UPLOAD_PRESET = options?.preset ?? PRESET_ENV
    const FOLDER_ENV = (import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER_AVATAR as string | undefined) ??
      (import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER as string | undefined)
    const UPLOAD_FOLDER = options?.folder ?? FOLDER_ENV

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      const missing = [!CLOUD_NAME && "VITE_CLOUDINARY_CLOUD_NAME", !UPLOAD_PRESET && "VITE_CLOUDINARY_UPLOAD_PRESET(_AVATAR)"].filter(Boolean).join(", ")
      throw new Error(`Cloudinary env vars missing: ${missing}`)
    }

    setUploading(true)
    setError(null)
    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      const form = new FormData()
      form.append("file", file)
      form.append("upload_preset", UPLOAD_PRESET)
      if (UPLOAD_FOLDER) form.append("folder", UPLOAD_FOLDER)

      const res = await fetch(url, { method: "POST", body: form })
      if (!res.ok) throw new Error(`Upload failed (${res.status})`)
      const data = (await res.json()) as UploadResult
      return data
    } finally {
      setUploading(false)
    }
  }, [options?.cloudName, options?.preset, options?.folder])

  return { upload, uploading, error, setError }
}

export default useCloudinaryUpload
