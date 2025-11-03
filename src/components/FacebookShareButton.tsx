import { useEffect } from "react"
import FacebookIconSvg from "../assets/svgs/FacebookIconSvg"

interface FacebookShareButtonProps {
  url: string
  title: string
  description: string
  imageUrl?: string
  hashtag?: string
  className?: string
}

const FacebookShareButton = ({
  url,
  title,
  description,
  imageUrl,
  hashtag = "#GrowMate",
  className = "",
}: FacebookShareButtonProps) => {
  // Update Open Graph meta tags dynamically
  useEffect(() => {
    // Store original meta tags
    const originalMetas = {
      title: document.querySelector('meta[property="og:title"]'),
      description: document.querySelector('meta[property="og:description"]'),
      image: document.querySelector('meta[property="og:image"]'),
      url: document.querySelector('meta[property="og:url"]'),
    }

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute("property", property)
        document.head.appendChild(meta)
      }
      meta.setAttribute("content", content)
    }

    updateMetaTag("og:title", title)
    updateMetaTag("og:description", description)
    updateMetaTag("og:url", url)
    updateMetaTag("og:type", "website")
    if (imageUrl) {
      updateMetaTag("og:image", imageUrl)
      updateMetaTag("og:image:width", "1200")
      updateMetaTag("og:image:height", "630")
    }

    // Cleanup function to restore original meta tags
    return () => {
      if (originalMetas.title) {
        const titleMeta = document.querySelector('meta[property="og:title"]')
        if (titleMeta)
          titleMeta.setAttribute(
            "content",
            originalMetas.title.getAttribute("content") || ""
          )
      }
      if (originalMetas.description) {
        const descMeta = document.querySelector(
          'meta[property="og:description"]'
        )
        if (descMeta)
          descMeta.setAttribute(
            "content",
            originalMetas.description.getAttribute("content") || ""
          )
      }
      if (originalMetas.image) {
        const imgMeta = document.querySelector('meta[property="og:image"]')
        if (imgMeta)
          imgMeta.setAttribute(
            "content",
            originalMetas.image.getAttribute("content") || ""
          )
      }
      if (originalMetas.url) {
        const urlMeta = document.querySelector('meta[property="og:url"]')
        if (urlMeta)
          urlMeta.setAttribute(
            "content",
            originalMetas.url.getAttribute("content") || ""
          )
      }
    }
  }, [url, title, description, imageUrl])

  const handleShare = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedQuote = encodeURIComponent(description)
    const encodedHashtag = encodeURIComponent(hashtag)

    // Facebook Share Dialog
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}&hashtag=${encodedHashtag}`

    // Open popup window
    const width = 700
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    window.open(
      shareUrl,
      "facebook-share",
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0,resizable=1`
    )
  }

  return (
    <button
      onClick={handleShare}
      className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Chia sẻ lên Facebook"
      title="Chia sẻ lên Facebook"
    >
      <FacebookIconSvg className="w-5 h-5 text-gray-700" />
    </button>
  )
}

export default FacebookShareButton
