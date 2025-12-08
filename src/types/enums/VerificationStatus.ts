export const VerificationStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const

export type VerificationStatus = typeof VerificationStatus[keyof typeof VerificationStatus]

// Helper functions for post/verification status
export const getVerificationStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case VerificationStatus.Approved:
      return "bg-green-100 text-green-800 border-green-300"
    case VerificationStatus.Pending:
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case VerificationStatus.Rejected:
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

export const getVerificationStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case VerificationStatus.Approved:
      return "Đã duyệt"
    case VerificationStatus.Pending:
      return "Chờ duyệt"
    case VerificationStatus.Rejected:
      return "Bị từ chối"
    default:
      return status
  }
}

// For API calls (uppercase format)
export const VerificationStatusAPI = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
} as const

export type VerificationStatusAPI = typeof VerificationStatusAPI[keyof typeof VerificationStatusAPI]
