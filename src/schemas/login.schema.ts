import {z} from 'zod'

export const loginSchema = z.object({
    identifier: z.string(), // can be username or email
    password: z.string()
})