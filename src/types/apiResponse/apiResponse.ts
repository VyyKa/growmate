// Envelope shape that backend may use consistently
export type ApiEnvelope<T> = {
	success?: boolean
	message?: string
	data?: T
} & Partial<T>

// Mutation helpers
export type CreateEnvelope<T, IdType extends string | number = number> = ApiEnvelope<{ entity: T; id: IdType }>

export type UpdateEnvelope<T> = ApiEnvelope<{ entity: T }>

export type DeleteEnvelope<IdType extends string | number = number> = ApiEnvelope<{ id: IdType }>


