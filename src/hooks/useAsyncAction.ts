import { useCallback, useState } from "react"

export type AsyncFunction<TArgs extends any[] = any[], TResult = unknown> = (
  ...args: TArgs
) => Promise<TResult>

export function useAsyncAction<TArgs extends any[] = any[], TResult = unknown>(
  fn: AsyncFunction<TArgs, TResult>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      setLoading(true)
      setError(null)
      try {
        const result = await fn(...args)
        return result
      } catch (err) {
        setError(err)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [fn]
  )

  return { run, loading, error }
}


