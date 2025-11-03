export const TreeHealthStatus = {
  Excellent: 'excellent',
  Good: 'good',
  Fair: 'fair',
  Poor: 'poor',
} as const
export type TreeHealthStatus = typeof TreeHealthStatus[keyof typeof TreeHealthStatus]
