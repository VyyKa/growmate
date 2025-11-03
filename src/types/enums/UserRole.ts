export const UserRole = {
	Guest: 0,
	Customer: 1,
	Farmer: 2,
	Admin: 3,
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// Optional helpers
export const isValidUserRole = (v: unknown): v is UserRole =>
	v === UserRole.Guest || v === UserRole.Customer || v === UserRole.Farmer || v === UserRole.Admin

