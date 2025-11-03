// Build query string from params, ignoring undefined / null / empty values
export const buildQuery = (params: Record<string, unknown>) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.append(k, String(v))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export default {
  buildQuery,
}
