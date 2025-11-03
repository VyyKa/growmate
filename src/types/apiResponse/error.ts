export type ProblemDetails = {
	title?: string
	detail?: string
	status?: number
	type?: string
	instance?: string
	errors?: Record<string, string[] | string>
	message?: string | string[]
	error?: string | { message?: string }
};
