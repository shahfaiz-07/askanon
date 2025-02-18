import {z} from 'zod'

export const verifySchema = z.object({
    verifyCode: z
    .string()
    .length(6, "Verification code/otp is of 6 digits")
})