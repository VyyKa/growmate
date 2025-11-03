type LoadOptions = {
  /**
   * If provided, the reader will check this field on the stored object.
   * When it's a number and already expired (Date.now() > value), the item is removed and undefined is returned.
   * Default: undefined (no expiry check)
   */
  checkExpiryField?: string
}

type SaveOptions = {
  expiresInMs?: number
  expiryField?: string
}

export const loadFromLocalStorage = <T = unknown>(
  key: string,
  options?: LoadOptions,
): T | undefined => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)

    const expiryField = options?.checkExpiryField
    if (
      expiryField &&
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as Record<string, unknown>)[expiryField] === "number"
    ) {
      const expiresAt = (parsed as Record<string, number>)[expiryField]
      if (Date.now() > expiresAt) {
          localStorage.removeItem(key)
        return undefined
      }
    }
    return parsed as T
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const saveToLocalStorage = <T = unknown>(
  key: string,
  value: T,
  options?: SaveOptions,
): void => {
    const toStore = (() => {
      if (!options?.expiresInMs) return value
      const field = options.expiryField ?? "expiresAt"
      if (value && typeof value === "object") {
        return { ...(value as Record<string, unknown>), [field]: Date.now() + options.expiresInMs }
      }
      // For non-objects, wrap to preserve the expiry info
      return { value, [field]: Date.now() + options.expiresInMs }
    })()

    localStorage.setItem(key, JSON.stringify(toStore))
}
