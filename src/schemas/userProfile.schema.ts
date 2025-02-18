import {z} from 'zod'

export const updateProfileSchema = z.object({
    firstname: z
        .string()
        .max(20, "Firstname cannot be more than 20 characters"),
    lastname: z
        .string()
        .max(20, "Lastname cannot be more than 20 characters")
        .optional(),
    bio: z
        .string()
        .max(150, "Bio cannot be more than 150 characters")
        .optional()
});