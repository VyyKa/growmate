import { Cloudinary } from "@cloudinary/url-gen"

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

if (!cloudName) {
  // Non-fatal: consumers may set this later; we warn for visibility in dev
  if (import.meta.env.DEV) {
    console.warn("[Cloudinary] Missing VITE_CLOUDINARY_CLOUD_NAME. Image transforms will not work until set.")
  }
}

export const cld = new Cloudinary({
  cloud: { cloudName: cloudName || "" },
})

export default cld
