import {z} from 'zod'

export const acceptQuestionsSchema = z.object({
    acceptQuestions: z.boolean(),
})