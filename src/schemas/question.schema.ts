import {z} from 'zod'

export const questionSchema = z.object({
    question: z
    .string()
    .min(10, "Question must contain atlest 10 characters")
    .max(300, "Question cannot contain more than 300 characters")
})