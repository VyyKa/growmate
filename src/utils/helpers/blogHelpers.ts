// Array of agricultural background images
const blogBackgroundImages = [
  'https://wallpapercave.com/wp/wp9212197.jpg', // Beautiful agricultural landscape
  '/src/assets/imgs/home2.png',  // Farm/garden image
  '/src/assets/imgs/home3.png',  // Agricultural products
  '/src/assets/imgs/home4.png',  // Vision/mission image
  '/src/assets/imgs/product1.jpg', // Product/farming image
]

/**
 * Get a random background image for blog pages
 * @returns string - path to background image
 */
export const getRandomBlogBackground = (): string => {
  const randomIndex = Math.floor(Math.random() * blogBackgroundImages.length)
  return blogBackgroundImages[randomIndex]
}

/**
 * Get a specific background image by index
 * @param index - index of the image (0-3)
 * @returns string - path to background image
 */
export const getBlogBackgroundByIndex = (index: number): string => {
  const safeIndex = Math.max(0, Math.min(index, blogBackgroundImages.length - 1))
  return blogBackgroundImages[safeIndex]
}

/**
 * Get all available background images
 * @returns string[] - array of background image paths
 */
export const getAllBlogBackgrounds = (): string[] => {
  return [...blogBackgroundImages]
}

/**
 * Get the default agricultural background image
 * @returns string - path to the default background image
 */
export const getDefaultBlogBackground = (): string => {
  return 'https://wallpapercave.com/wp/wp9212197.jpg'
}
