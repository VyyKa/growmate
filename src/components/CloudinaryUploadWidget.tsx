import React, { useCallback, useRef } from "react"
import useCloudinaryUpload from "../hooks/useCloudinaryUpload"
import UploadImgIconSvg from "../assets/svgs/UploadImgIconSvg"

/**
 * A minimal upload input using unsigned upload.
 * For advanced UI (cropping, multiple), consider Cloudinary Upload Widget.
 */
export type CloudinaryUploadWidgetProps = {
  onUploaded?: (result: { publicId: string; url: string }) => void
  accept?: string
  multiple?: boolean
  className?: string
  showAsButton?: boolean
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onUploaded,
  accept = "image/*",
  multiple = false,
  className,
  showAsButton = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { upload, uploading, error } = useCloudinaryUpload({
    // Make it explicit: prefer avatar-specific preset/folder; still falls back inside the hook
    preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_AVATAR as
      | string
      | undefined,
    folder:
      (import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER_AVATAR as
        | string
        | undefined) || "UserAvatar",
  })

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const res = await upload(file)
      onUploaded?.({ publicId: res.public_id, url: res.secure_url })
    },
    [upload, onUploaded]
  )

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  if (showAsButton) {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="w-full h-full flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-sm rounded-full border-2 border-dashed border-green-400 hover:border-green-600 hover:bg-green-50 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-8 w-8 text-green-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-xs text-gray-600 font-medium">
                Đang tải...
              </span>
            </>
          ) : (
            <>
              <UploadImgIconSvg size={32} className="text-green-600" />
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={uploading}
        className="block"
      />
      {uploading && (
        <p className="text-sm text-gray-500 mt-1">
          Đang tải ảnh lên Cloudinary...
        </p>
      )}
      {!uploading && error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

export default CloudinaryUploadWidget
