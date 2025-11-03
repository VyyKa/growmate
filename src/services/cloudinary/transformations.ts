import { scale } from "@cloudinary/url-gen/actions/resize"
import { format, quality } from "@cloudinary/url-gen/actions/delivery"
import { auto } from "@cloudinary/url-gen/qualifiers/format"
import cld from "./client"
import { DEFAULT_IMAGES } from "../../utils/constants/defaultImage"

/**
 * Build a transformed image URL from a publicId with a provided fallback.
 */
export type TransformOpts = { width?: number; height?: number; quality?: number }

const buildImageUrl = (
  publicId: string,
  fallbackSrc: string,
  opts?: TransformOpts
) => {
  try {
    const cloudName = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
    if (!cloudName || !publicId) return fallbackSrc
    if (/^https?:\/\//i.test(publicId)) return publicId

    const img = cld.image(publicId)
    if (opts?.width || opts?.height) {
      const r = scale()
      if (typeof opts.width === "number") r.width(opts.width)
      if (typeof opts.height === "number") r.height(opts.height)
      img.resize(r)
    }
    img.delivery(quality(opts?.quality ?? 80)).delivery(format(auto()))
    return img.toURL()
  } catch {
    return fallbackSrc
  }
}

// Per-kind helpers (no fallback map needed)
export const getProductImageUrl = (publicId: string, opts?: TransformOpts) =>
  buildImageUrl(publicId, DEFAULT_IMAGES.PRODUCT, opts)

export const getAdoptImageUrl = (publicId: string, opts?: TransformOpts) =>
  buildImageUrl(publicId, DEFAULT_IMAGES.ADOPT, opts)

export const getAvatarImageUrl = (publicId: string, opts?: TransformOpts) =>
  buildImageUrl(publicId, DEFAULT_IMAGES.AVATAR, opts)

// Generic helper retained for compatibility; defaults to product fallback
export const getImageUrl = (
  publicId: string,
  opts?: TransformOpts & { fallbackSrc?: string }
) => buildImageUrl(publicId, opts?.fallbackSrc ?? DEFAULT_IMAGES.PRODUCT, opts)

export default getImageUrl
