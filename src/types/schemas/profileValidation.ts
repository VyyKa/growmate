import { z } from "zod"
import { emailSchema, phoneSchema, fullNameSchema } from "./common"

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  email: emailSchema,
  profileImageUrl: z.string().url().optional().or(z.literal("")),
})

export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>

// Helper to parse errors into a simple field -> message map
export function parseZodErrors(err: unknown): Record<string, string> {
  if (err instanceof z.ZodError) {
    const map: Record<string, string> = {}
    for (const issue of err.issues) {
      const field = issue.path.join(".") || "form"
      if (!map[field]) map[field] = issue.message
    }
    return map
  }
  return {}
}
