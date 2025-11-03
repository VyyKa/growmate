import { z } from "zod"
import {
  emailSchema,
  phoneSchema,
  fullNameSchema,
  messageSchema,
} from "./common"

export const contactSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneSchema,
  email: emailSchema,
  message: messageSchema,
})

export type ContactForm = z.infer<typeof contactSchema>
